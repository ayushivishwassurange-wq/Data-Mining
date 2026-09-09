import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, load_artifacts

# Pre-load artifacts for testing
load_artifacts()
client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["model_loaded"] is True
    assert "champion_model" in data

def test_single_trip_prediction():
    payload = {
        "pickup_longitude": -73.9855,
        "pickup_latitude": 40.7580,
        "dropoff_longitude": -73.7781,
        "dropoff_latitude": 40.6413,
        "passenger_count": 2,
        "pickup_datetime": "2025-06-15 17:30:00"
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["predicted_fare"] > 10.0
    assert data["distance_miles"] > 5.0
    assert "breakdown" in data
    assert data["breakdown"]["base_charge"] == 3.00
    assert len(data["top_contributions"]) > 0

def test_batch_prediction():
    payload = {
        "trips": [
            {
                "key": "trip_1",
                "pickup_longitude": -73.9855,
                "pickup_latitude": 40.7580,
                "dropoff_longitude": -73.9772,
                "dropoff_latitude": 40.7527,
                "passenger_count": 1
            },
            {
                "key": "trip_2",
                "pickup_longitude": -74.0090,
                "pickup_latitude": 40.7070,
                "dropoff_longitude": -73.7781,
                "dropoff_latitude": 40.6413,
                "passenger_count": 3
            }
        ]
    }
    response = client.post("/api/predict/batch", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["total_trips"] == 2
    assert len(data["predictions"]) == 2

def test_benchmarks_endpoint():
    response = client.get("/api/models/benchmark")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["models"]) == 4

def test_eda_insights_endpoint():
    response = client.get("/api/eda/insights")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "hourly_avg_fare" in data["data"]
    assert "fare_binned_distribution" in data["data"]

def test_feature_importance_endpoint():
    response = client.get("/api/features/importance")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["features"]) > 10
