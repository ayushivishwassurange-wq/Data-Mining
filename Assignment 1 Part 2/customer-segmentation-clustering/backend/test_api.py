import os
import sys
import pytest
from fastapi.testclient import TestClient

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))
sys.path.insert(0, os.path.join(BASE_DIR, "ml_engine"))

from app import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["total_customers"] == 500
    assert len(data["available_algorithms"]) == 4

def test_eda():
    response = client.get("/api/eda")
    assert response.status_code == 200
    data = response.json()
    assert data["total_customers"] == 500
    assert "AnnualIncome" in data["summary_stats"]
    assert "SpendingScore" in data["correlation_matrix"]
    assert len(data["histograms"]) > 0

def test_customers():
    response = client.get("/api/customers")
    assert response.status_code == 200
    data = response.json()
    assert data["total_customers"] == 500
    assert len(data["customers"]) == 500
    cust = data["customers"][0]
    assert "pca_x" in cust
    assert "pca_y" in cust
    assert "kmeans_cluster" in cust

def test_elbow_curves():
    response = client.get("/api/elbow/curves")
    assert response.status_code == 200
    data = response.json()
    assert len(data["k_values"]) == 9 # k=2..10
    assert len(data["inertias"]) == 9
    assert len(data["silhouettes"]) == 9

def test_personas():
    response = client.get("/api/personas")
    assert response.status_code == 200
    data = response.json()
    assert len(data["personas"]) >= 4
    p = data["personas"][0]
    assert "name" in p
    assert "actionable_strategy" in p

def test_run_kmeans():
    response = client.post("/api/clustering/run", json={"algorithm": "kmeans", "n_clusters": 5})
    assert response.status_code == 200
    data = response.json()
    assert data["algorithm"] == "K-Means"
    assert data["n_clusters"] == 5
    assert len(data["labels"]) == 500
    assert data["metrics"]["silhouette_score"] > 0
    assert data["metrics"]["inertia"] is not None

def test_run_dbscan():
    response = client.post("/api/clustering/run", json={"algorithm": "dbscan", "eps": 0.65, "min_samples": 5})
    assert response.status_code == 200
    data = response.json()
    assert data["algorithm"] == "DBSCAN"
    assert data["metrics"]["noise_points"] is not None
    assert len(data["labels"]) == 500

def test_run_hierarchical():
    response = client.post("/api/clustering/run", json={"algorithm": "hierarchical", "n_clusters": 5, "linkage": "ward"})
    assert response.status_code == 200
    data = response.json()
    assert data["algorithm"] == "Agglomerative Hierarchical"
    assert data["n_clusters"] == 5

def test_run_gmm():
    response = client.post("/api/clustering/run", json={"algorithm": "gmm", "n_clusters": 5, "covariance_type": "full"})
    assert response.status_code == 200
    data = response.json()
    assert "Gaussian Mixture" in data["algorithm"]
    assert data["metrics"]["bic"] is not None

def test_customer_predict():
    payload = {
        "gender": "Female",
        "age": 32,
        "annual_income": 95.0,
        "spending_score": 85.0,
        "recency": 10,
        "frequency": 35,
        "monetary": 8500.0
    }
    response = client.post("/api/cluster/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "cluster_id" in data
    assert "persona_name" in data
    assert "actionable_strategy" in data
    assert "pca_coordinates" in data

def test_crisp_dm():
    response = client.get("/api/crisp-dm")
    assert response.status_code == 200
    data = response.json()
    assert len(data["phases"]) == 6
    assert data["phases"][0]["name"] == "Business Understanding"
    assert data["phases"][5]["name"] == "Deployment & Monitoring"
