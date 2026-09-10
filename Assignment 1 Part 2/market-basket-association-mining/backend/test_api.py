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
    assert data["total_transactions"] == 1000
    assert len(data["available_algorithms"]) == 3

def test_eda():
    response = client.get("/api/eda")
    assert response.status_code == 200
    data = response.json()
    assert data["total_transactions"] == 1000
    assert len(data["top_frequent_items"]) > 0
    assert len(data["basket_size_distribution"]) > 0
    assert len(data["category_share"]) > 0

def test_network_graph():
    response = client.get("/api/network/graph")
    assert response.status_code == 200
    data = response.json()
    assert data["total_nodes"] > 0
    assert data["total_links"] > 0
    assert len(data["nodes"]) > 0
    assert len(data["links"]) > 0

def test_benchmark_speed():
    response = client.get("/api/benchmark/speed")
    assert response.status_code == 200
    data = response.json()
    assert len(data["benchmarks"]) >= 3
    bench = data["benchmarks"][0]
    assert "apriori_ms" in bench
    assert "fp_growth_ms" in bench
    assert "eclat_ms" in bench

def test_frequent_itemsets():
    response = client.get("/api/frequent/itemsets")
    assert response.status_code == 200
    data = response.json()
    assert data["total_count"] > 0
    assert len(data["itemsets"]) > 0

def test_mine_rules_fp_growth():
    payload = {
        "algorithm": "fp_growth",
        "min_support": 0.04,
        "min_confidence": 0.25,
        "min_lift": 1.2
    }
    response = client.post("/api/rules/mine", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["algorithm"] == "FP_GROWTH"
    assert data["total_rules_mined"] > 0
    assert len(data["rules"]) > 0
    rule = data["rules"][0]
    assert rule["lift"] >= 1.2
    assert rule["confidence"] >= 0.25

def test_mine_rules_apriori():
    payload = {
        "algorithm": "apriori",
        "min_support": 0.05,
        "min_confidence": 0.3,
        "min_lift": 1.1
    }
    response = client.post("/api/rules/mine", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["algorithm"] == "APRIORI"
    assert data["total_rules_mined"] > 0

def test_mine_rules_eclat():
    payload = {
        "algorithm": "eclat",
        "min_support": 0.05,
        "min_confidence": 0.3,
        "min_lift": 1.1
    }
    response = client.post("/api/rules/mine", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["algorithm"] == "ECLAT"

def test_recommend_basket():
    payload = {
        "items": ["Italian Pasta", "Organic Tomato Sauce"],
        "top_k": 3
    }
    response = client.post("/api/recommend/basket", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["current_basket"]) == 2
    assert len(data["recommendations"]) > 0
    assert len(data["bundle_suggestions"]) > 0

def test_crisp_dm():
    response = client.get("/api/crisp-dm")
    assert response.status_code == 200
    data = response.json()
    assert len(data["phases"]) == 6
    assert data["phases"][0]["name"] == "Business Understanding"
    assert data["phases"][5]["name"] == "Deployment & Monitoring"
