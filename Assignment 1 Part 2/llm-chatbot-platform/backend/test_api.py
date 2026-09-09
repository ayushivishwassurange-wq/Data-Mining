import pytest
from fastapi.testclient import TestClient
import os
import sys

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
    assert "MiniLLM" in data["model"]
    assert data["parameters"] > 0
    assert data["vocab_size"] > 0

def test_tokenize():
    response = client.post("/api/tokenizer/tokenize", json={"text": "Hello CRISP-DM AI"})
    assert response.status_code == 200
    data = response.json()
    assert data["text"] == "Hello CRISP-DM AI"
    assert len(data["token_ids"]) > 0
    assert len(data["segments"]) > 0
    assert data["compression_ratio"] > 0

def test_attention_inspect():
    response = client.post("/api/attention/inspect", json={"text": "Explain transformers"})
    assert response.status_code == 200
    data = response.json()
    assert data["n_layers"] == 4
    assert data["n_heads"] == 4
    assert len(data["layers"]) == 4
    assert len(data["layers"][0]["heads"]) == 4


def test_telemetry():
    response = client.get("/api/telemetry")
    assert response.status_code == 200
    data = response.json()
    assert "Decoder-Only" in data["model_architecture"]
    assert data["parameters"] > 0
    assert data["layers"] == 4

def test_training_history():
    response = client.get("/api/training/history")
    assert response.status_code == 200
    data = response.json()
    assert len(data["epochs"]) > 0
    assert len(data["train_loss"]) > 0
    assert len(data["val_perplexity"]) > 0

def test_crisp_dm():
    response = client.get("/api/crisp-dm")
    assert response.status_code == 200
    data = response.json()
    assert len(data["phases"]) == 6
    assert data["phases"][0]["name"] == "Business Understanding"
    assert data["phases"][5]["name"] == "Deployment"

def test_finetune():
    response = client.post("/api/training/finetune", json={"text": "Machine learning is powerful", "epochs": 2})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["losses"]) == 2
