import os
import sys
import time
import json
import joblib
import numpy as np
import pandas as pd

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

from dataset import generate_nyc_taxi_dataset
from features import NYCTaxiFeatureExtractor, haversine_distance, manhattan_distance

def evaluate_model_performance(model, X_train, y_train, X_test, y_test, model_name="Model"):
    print(f"[*] Training {model_name}...")
    start_time = time.time()
    model.fit(X_train, y_train)
    train_time = time.time() - start_time

    # Latency test on test set
    start_lat = time.time()
    y_pred = model.predict(X_test)
    inference_time_ms = ((time.time() - start_lat) / len(X_test)) * 1000

    # Metrics
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100

    print(f"    [>] {model_name} -> RMSE: ${rmse:.3f}, MAE: ${mae:.3f}, R2: {r2:.4f}, Train Time: {train_time:.2f}s, Latency: {inference_time_ms:.4f}ms/pred")

    return {
        "model_name": model_name,
        "rmse": float(round(rmse, 3)),
        "mae": float(round(mae, 3)),
        "r2": float(round(r2, 4)),
        "mape": float(round(mape, 2)),
        "train_time_sec": float(round(train_time, 2)),
        "latency_ms_per_pred": float(round(inference_time_ms, 4)),
        "predictions_sample": [float(round(p, 2)) for p in y_pred[:15]],
        "actuals_sample": [float(round(a, 2)) for a in y_test[:15]],
    }

def main():
    print("=" * 70)
    print("NYC TAXI CHALLENGE - CRISP-DM MACHINE LEARNING PIPELINE")
    print("=" * 70)

    artifacts_dir = os.path.join(os.path.dirname(__file__), "artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)

    # 1. Generate & Ingest Data
    print("\n[Phase 1 & 2: Business & Data Understanding] Generating NYC Taxi Dataset...")
    df = generate_nyc_taxi_dataset(n_samples=30000, random_state=42)
    print(f"[+] Generated {len(df)} validated NYC trip records.")

    # Save sample CSV for EDA & user batch testing
    sample_csv_path = os.path.join(artifacts_dir, "sample_nyc_trips.csv")
    df.head(100).to_csv(sample_csv_path, index=False)
    print(f"[+] Saved sample dataset to: {sample_csv_path}")

    # Generate EDA Insights Summary for Frontend Charts
    print("\n[Phase 2: Exploratory Data Analysis telemetry]")
    p_lon = df['pickup_longitude'].values
    p_lat = df['pickup_latitude'].values
    d_lon = df['dropoff_longitude'].values
    d_lat = df['dropoff_latitude'].values
    dist_miles = haversine_distance(p_lon, p_lat, d_lon, d_lat)
    
    dt_series = pd.to_datetime(df['pickup_datetime'])
    hours = dt_series.dt.hour
    hourly_avg_fare = df.groupby(hours)['fare_amount'].mean().round(2).to_dict()
    hourly_trip_counts = hours.value_counts().sort_index().to_dict()

    eda_summary = {
        "total_records": len(df),
        "mean_fare": float(round(df['fare_amount'].mean(), 2)),
        "median_fare": float(round(df['fare_amount'].median(), 2)),
        "std_fare": float(round(df['fare_amount'].std(), 2)),
        "min_fare": float(round(df['fare_amount'].min(), 2)),
        "max_fare": float(round(df['fare_amount'].max(), 2)),
        "mean_distance_miles": float(round(np.mean(dist_miles), 2)),
        "passenger_distribution": df['passenger_count'].value_counts().sort_index().to_dict(),
        "hourly_avg_fare": {str(k): v for k, v in hourly_avg_fare.items()},
        "hourly_trip_counts": {str(k): v for k, v in hourly_trip_counts.items()},
        "fare_binned_distribution": [
            {"range": "$3 - $10", "count": int((df['fare_amount'] <= 10).sum())},
            {"range": "$10 - $20", "count": int(((df['fare_amount'] > 10) & (df['fare_amount'] <= 20)).sum())},
            {"range": "$20 - $35", "count": int(((df['fare_amount'] > 20) & (df['fare_amount'] <= 35)).sum())},
            {"range": "$35 - $60", "count": int(((df['fare_amount'] > 35) & (df['fare_amount'] <= 60)).sum())},
            {"range": "$60+", "count": int((df['fare_amount'] > 60).sum())},
        ]
    }

    with open(os.path.join(artifacts_dir, "eda_summary.json"), "w") as f:
        json.dump(eda_summary, f, indent=2)

    # 2. Data Preparation & Feature Engineering
    print("\n[Phase 3: Data Preparation] Applying NYCTaxiFeatureExtractor...")
    extractor = NYCTaxiFeatureExtractor()
    X = extractor.transform(df)
    y = df['fare_amount'].values
    feature_names = extractor.feature_names_
    print(f"[+] Extracted {len(feature_names)} engineered features: {feature_names[:6]}...")

    with open(os.path.join(artifacts_dir, "feature_names.json"), "w") as f:
        json.dump(feature_names, f, indent=2)

    # Train / Test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)

    # 3. Model Training & Comparison Suite
    print("\n[Phase 4 & 5: Modeling & Evaluation] Benchmarking 4 Algorithm Paradigms...")
    
    models = {
        "Linear Regression (Baseline)": LinearRegression(),
        "Ridge Regression (L2)": Ridge(alpha=1.0),
        "Random Forest Regressor": RandomForestRegressor(n_estimators=80, max_depth=12, n_jobs=-1, random_state=42),
        "XGBoost Regressor (Champion)": XGBRegressor(n_estimators=200, max_depth=6, learning_rate=0.08, subsample=0.85, random_state=42, n_jobs=-1)
    }

    benchmark_results = []
    trained_models = {}

    for name, model in models.items():
        metrics = evaluate_model_performance(model, X_train, y_train, X_test, y_test, name)
        benchmark_results.append(metrics)
        trained_models[name] = model

    # 4. Feature Importance Extraction from XGBoost
    best_model_name = "XGBoost Regressor (Champion)"
    best_model = trained_models[best_model_name]
    importances = best_model.feature_importances_
    sorted_idx = np.argsort(importances)[::-1]

    feature_importance_list = [
        {"feature": feature_names[i], "importance": float(round(importances[i], 4))}
        for i in sorted_idx
    ]

    with open(os.path.join(artifacts_dir, "feature_importance.json"), "w") as f:
        json.dump(feature_importance_list, f, indent=2)

    with open(os.path.join(artifacts_dir, "benchmark_results.json"), "w") as f:
        json.dump(benchmark_results, f, indent=2)

    # 5. Serialization of Champion Model Artifact
    print("\n[Phase 6: Deployment Artifacts] Serializing Champion Model...")
    joblib.dump(best_model, os.path.join(artifacts_dir, "best_model.joblib"))
    joblib.dump(extractor, os.path.join(artifacts_dir, "feature_extractor.joblib"))

    metadata = {
        "project": "NYC Taxi Challenge - CRISP-DM Fare Prediction",
        "framework": "CRISP-DM",
        "champion_model": best_model_name,
        "n_training_samples": len(X_train),
        "n_test_samples": len(X_test),
        "rmse": benchmark_results[-1]["rmse"],
        "mae": benchmark_results[-1]["mae"],
        "r2_score": benchmark_results[-1]["r2"],
        "created_at": time.strftime('%Y-%m-%dT%H:%M:%S'),
        "author": "Antigravity Data Science & ML Engine"
    }

    with open(os.path.join(artifacts_dir, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"[+] Pipeline successfully completed! Champion Model saved to {artifacts_dir}/best_model.joblib")

if __name__ == "__main__":
    main()
