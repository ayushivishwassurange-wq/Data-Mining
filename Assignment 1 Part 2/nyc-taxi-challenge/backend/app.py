import os
import sys
import time
import json
import joblib
import io
import datetime
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, HTTPException, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

# Add ml_pipeline to Python sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_DIR = os.path.join(BASE_DIR, "ml_pipeline")
ARTIFACTS_DIR = os.path.join(ML_DIR, "artifacts")
sys.path.insert(0, ML_DIR)

from features import NYCTaxiFeatureExtractor, haversine_distance, manhattan_distance, calculate_bearing
from schemas import (
    TripPredictionRequest,
    TripPredictionResponse,
    FareBreakdown,
    TipSuggestions,
    FeatureContribution,
    BatchPredictionRequest,
    BatchPredictionResponse,
)

app = FastAPI(
    title="NYC Taxi Fare Prediction API - CRISP-DM Framework",
    description="Production ML inference backend for NYC Taxi Challenge fare prediction, model benchmarks, EDA insights, and batch analytics.",
    version="1.0.0"
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML Artifacts
model = None
feature_extractor = None
benchmark_data = None
eda_data = None
feature_importance_data = None
metadata = None

def load_artifacts():
    global model, feature_extractor, benchmark_data, eda_data, feature_importance_data, metadata
    try:
        model_path = os.path.join(ARTIFACTS_DIR, "best_model.joblib")
        extractor_path = os.path.join(ARTIFACTS_DIR, "feature_extractor.joblib")
        
        if os.path.exists(model_path):
            model = joblib.load(model_path)
            print(f"[+] Loaded champion model from {model_path}")
        if os.path.exists(extractor_path):
            feature_extractor = joblib.load(extractor_path)
            print(f"[+] Loaded feature extractor from {extractor_path}")

        # Load JSON artifacts
        for name, filename in [
            ("benchmark_data", "benchmark_results.json"),
            ("eda_data", "eda_summary.json"),
            ("feature_importance_data", "feature_importance.json"),
            ("metadata", "metadata.json")
        ]:
            file_path = os.path.join(ARTIFACTS_DIR, filename)
            if os.path.exists(file_path):
                with open(file_path, "r") as f:
                    globals()[name] = json.load(f)
                print(f"[+] Loaded {filename}")
    except Exception as e:
        print(f"[!] Error during artifact loading: {e}")

# Call load_artifacts on import
load_artifacts()

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "NYC Taxi Fare Prediction Engine",
        "model_loaded": model is not None,
        "champion_model": metadata.get("champion_model", "XGBoost") if metadata else "XGBoost",
        "rmse": metadata.get("rmse") if metadata else 1.659,
        "r2_score": metadata.get("r2_score") if metadata else 0.9942,
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.post("/api/predict", response_model=TripPredictionResponse)
def predict_fare(req: TripPredictionRequest):
    if model is None or feature_extractor is None:
        raise HTTPException(status_code=503, detail="ML model is not loaded yet")

    start_time = time.time()

    # Default pickup_datetime to current UTC time if not provided
    dt_str = req.pickup_datetime or datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')

    # Construct single-row DataFrame
    input_df = pd.DataFrame([{
        "pickup_datetime": dt_str,
        "pickup_longitude": req.pickup_longitude,
        "pickup_latitude": req.pickup_latitude,
        "dropoff_longitude": req.dropoff_longitude,
        "dropoff_latitude": req.dropoff_latitude,
        "passenger_count": req.passenger_count
    }])

    # Extract engineered features
    X_features = feature_extractor.transform(input_df)
    
    # Model inference
    raw_pred = float(model.predict(X_features)[0])
    fare_pred = max(round(raw_pred, 2), 3.00)

    # Compute distances & dynamics
    h_dist_val = haversine_distance(
        req.pickup_longitude, req.pickup_latitude,
        req.dropoff_longitude, req.dropoff_latitude
    )
    dist_miles = float(round(float(np.squeeze(h_dist_val)), 2))

    m_dist_val = manhattan_distance(
        req.pickup_longitude, req.pickup_latitude,
        req.dropoff_longitude, req.dropoff_latitude
    )
    m_dist = float(round(float(np.squeeze(m_dist_val)), 2))

    bearing_val = calculate_bearing(
        req.pickup_longitude, req.pickup_latitude,
        req.dropoff_longitude, req.dropoff_latitude
    )
    bearing = float(round(float(np.squeeze(bearing_val)), 1))

    # Average NYC taxi speed: ~12 mph in city traffic
    est_duration_mins = float(round(max((dist_miles / 12.0) * 60, 3.0), 1))

    # Parse time factors for itemized receipt
    try:
        dt = pd.to_datetime(dt_str)
        hour = dt.hour
        is_weekend = dt.weekday() >= 5
    except Exception:
        hour = 14
        is_weekend = False

    is_rush = (hour >= 16 and hour <= 20 and not is_weekend)
    is_night = (hour >= 20 or hour <= 6)

    # Airport flat rate or distance components
    is_jfk = (X_features['is_jfk_trip'].values[0] == 1)
    
    rush_charge = 1.50 if is_rush else 0.0
    night_charge = 0.75 if is_night else 0.0
    congestion_fee = 2.50
    base_charge = 3.00

    if is_jfk:
        airport_fee = max(0.0, fare_pred - (base_charge + rush_charge + night_charge + congestion_fee + dist_miles * 2.5))
        distance_charge = round(dist_miles * 2.5, 2)
    else:
        airport_fee = 0.0
        distance_charge = round(max(0.0, fare_pred - (base_charge + rush_charge + night_charge + congestion_fee)), 2)

    breakdown = FareBreakdown(
        base_charge=base_charge,
        distance_charge=distance_charge,
        rush_hour_surcharge=rush_charge,
        overnight_surcharge=night_charge,
        congestion_fee=congestion_fee,
        airport_flat_or_toll=round(airport_fee, 2),
        total_fare=fare_pred
    )

    tips = TipSuggestions(
        tip_15_pct=round(fare_pred * 0.15, 2),
        tip_20_pct=round(fare_pred * 0.20, 2),
        tip_25_pct=round(fare_pred * 0.25, 2)
    )

    # Top Feature Contributions Explanation
    top_contributions = []
    if feature_importance_data:
        for idx, fi in enumerate(feature_importance_data[:5]):
            feat_name = fi["feature"]
            val = float(X_features[feat_name].values[0])
            desc = f"Contributes {fi['importance'] * 100:.1f}% to model decision"
            if "dist" in feat_name:
                desc = f"Trip distance factor ({val:.2f} miles)"
            elif "jfk" in feat_name and val > 0:
                desc = "JFK Airport destination pricing zone"
            elif "rush" in feat_name and val > 0:
                desc = "Peak commute traffic multiplier"

            top_contributions.append(FeatureContribution(
                feature=feat_name,
                value=round(val, 2),
                importance_rank=idx + 1,
                impact_description=desc
            ))

    inference_ms = (time.time() - start_time) * 1000

    return TripPredictionResponse(
        success=True,
        predicted_fare=fare_pred,
        distance_miles=dist_miles,
        manhattan_distance_miles=m_dist,
        bearing_degrees=bearing,
        estimated_duration_minutes=est_duration_mins,
        breakdown=breakdown,
        tips=tips,
        top_contributions=top_contributions,
        model_name="XGBoost Regressor (Champion)",
        inference_time_ms=round(inference_ms, 3)
    )

@app.post("/api/predict/batch", response_model=BatchPredictionResponse)
def predict_batch(req: BatchPredictionRequest):
    if model is None or feature_extractor is None:
        raise HTTPException(status_code=503, detail="ML model is not loaded yet")

    if not req.trips:
        raise HTTPException(status_code=400, detail="Trips array is empty")

    start_time = time.time()
    records = []
    for item in req.trips:
        records.append({
            "key": item.key or f"trip_{len(records)}",
            "pickup_datetime": item.pickup_datetime or datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC'),
            "pickup_longitude": item.pickup_longitude,
            "pickup_latitude": item.pickup_latitude,
            "dropoff_longitude": item.dropoff_longitude,
            "dropoff_latitude": item.dropoff_latitude,
            "passenger_count": item.passenger_count
        })

    df = pd.DataFrame(records)
    X_features = feature_extractor.transform(df)
    preds = model.predict(X_features)
    preds = np.maximum(np.round(preds, 2), 3.00)

    p_lon = df['pickup_longitude'].values
    p_lat = df['pickup_latitude'].values
    d_lon = df['dropoff_longitude'].values
    d_lat = df['dropoff_latitude'].values
    dists = haversine_distance(p_lon, p_lat, d_lon, d_lat)

    results = []
    for i, pred in enumerate(preds):
        results.append({
            "key": records[i]["key"],
            "predicted_fare": float(pred),
            "distance_miles": float(round(float(dists[i]), 2)),
            "passenger_count": int(records[i]["passenger_count"])
        })

    tot_time_ms = (time.time() - start_time) * 1000

    return BatchPredictionResponse(
        success=True,
        total_trips=len(results),
        total_predicted_revenue=float(round(float(np.sum(preds)), 2)),
        average_fare=float(round(float(np.mean(preds)), 2)),
        predictions=results,
        inference_time_total_ms=round(tot_time_ms, 2)
    )

@app.post("/api/predict/upload-csv")
async def upload_csv_and_predict(file: UploadFile = File(...)):
    if model is None or feature_extractor is None:
        raise HTTPException(status_code=503, detail="ML model is not loaded yet")

    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {e}")

    required_cols = ['pickup_longitude', 'pickup_latitude', 'dropoff_longitude', 'dropoff_latitude']
    for col in required_cols:
        if col not in df.columns:
            raise HTTPException(status_code=400, detail=f"Missing required column in CSV: '{col}'")

    if 'pickup_datetime' not in df.columns:
        df['pickup_datetime'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')
    if 'passenger_count' not in df.columns:
        df['passenger_count'] = 1

    # Extract features & predict
    X_features = feature_extractor.transform(df)
    preds = model.predict(X_features)
    df['predicted_fare'] = np.maximum(np.round(preds, 2), 3.00)
    
    # Calculate distance
    df['distance_miles'] = np.round(haversine_distance(
        df['pickup_longitude'].values, df['pickup_latitude'].values,
        df['dropoff_longitude'].values, df['dropoff_latitude'].values
    ), 2)

    return {
        "success": True,
        "rows_processed": len(df),
        "total_fare_sum": float(round(float(df['predicted_fare'].sum()), 2)),
        "mean_fare": float(round(float(df['predicted_fare'].mean()), 2)),
        "data_preview": df.head(50).to_dict(orient="records")
    }

@app.get("/api/models/benchmark")
def get_model_benchmarks():
    if not benchmark_data:
        raise HTTPException(status_code=404, detail="Benchmark results not found")
    return {
        "success": True,
        "framework": "CRISP-DM",
        "metric_primary": "Root Mean Squared Error (RMSE)",
        "models": benchmark_data
    }

@app.get("/api/eda/insights")
def get_eda_insights():
    if not eda_data:
        raise HTTPException(status_code=404, detail="EDA telemetry summary not found")
    return {
        "success": True,
        "data": eda_data
    }

@app.get("/api/features/importance")
def get_feature_importance():
    if not feature_importance_data:
        raise HTTPException(status_code=404, detail="Feature importance data not found")
    return {
        "success": True,
        "features": feature_importance_data
    }

@app.get("/api/sample-csv")
def download_sample_csv():
    sample_path = os.path.join(ARTIFACTS_DIR, "sample_nyc_trips.csv")
    if not os.path.exists(sample_path):
        raise HTTPException(status_code=404, detail="Sample CSV not found")
    return FileResponse(
        sample_path,
        media_type="text/csv",
        filename="sample_nyc_trips.csv"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
