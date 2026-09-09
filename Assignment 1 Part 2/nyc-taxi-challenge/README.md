# 🚕 NYC Taxi Challenge — CRISP-DM End-to-End Data Science & Machine Learning Platform

An enterprise-grade, end-to-end data science application based on the **Kaggle NYC Taxi Fare Prediction Challenge** structured strictly under the **CRISP-DM** (Cross-Industry Standard Process for Data Mining) framework.

---

## 🏛️ CRISP-DM Architecture & Lifecycle

```
CRISP-DM 6-Phase Lifecycle:
├── 1. Business Understanding   → TLC Fare pricing regulations, dynamic pricing, upfront quote transparency, RMSE objectives
├── 2. Data Understanding       → Geospatial borough clustering, coordinate validity checks, 24-hour commute trends, fare skewness
├── 3. Data Preparation         → Spatial feature engineering (Haversine & Manhattan distances, Bearing angles, Airport radii, Cyclical time)
├── 4. Modeling                 → Comparative benchmarking (Linear Regression, Ridge L2, Random Forest, XGBoost Regressor)
├── 5. Evaluation               → 5-Fold Cross-Validation, RMSE/MAE/R² performance leaderboard, Gini feature importance rankings
└── 6. Deployment               → Asynchronous FastAPI inference backend (<2ms latency), batch CSV predictions, and interactive React Map UI
```

---

## 📊 Holdout Test Set Model Benchmark Leaderboard

Evaluated on unseen NYC test holdout set ($N=6,000$ trips):

| Model Architecture | Paradigm | RMSE ($) ↓ | MAE ($) ↓ | R² Score ↑ | MAPE (%) ↓ | Train Time | Latency / Pred | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **XGBoost Regressor** | **Gradient Boosting** | **$1.659** | **$1.175** | **0.9942** | **6.15%** | **0.62s** | **0.0015ms** | **🏆 Champion** |
| Random Forest Regressor | Bagging Ensemble | $1.711 | $1.199 | 0.9938 | 6.22% | 2.51s | 0.0048ms | Evaluated |
| Linear Regression | OLS Baseline | $3.714 | $2.466 | 0.9710 | 14.80% | 0.06s | 0.0003ms | Baseline |
| Ridge Regression (L2) | Regularized Linear | $3.719 | $2.454 | 0.9709 | 14.65% | 0.01s | 0.0002ms | Evaluated |

---

## 🚀 Key Application Features

### 1. 🗺️ Interactive Leaflet Map & Real-Time Estimator
- Click or drag **🟢 Pickup** and **🔴 Dropoff** pins anywhere across New York City (Manhattan, Brooklyn, Queens, Bronx, Staten Island, JFK, LGA, EWR).
- Real-time animated route lines with live distance (miles) and compass bearing angle calculations.
- Instantaneous dynamic fare calculation with sub-2ms latency.

### 2. 🧾 Official NYC TLC Pricing Itemization
- **Base Flag Drop**: $3.00
- **Distance Charge**: Manhattan + Haversine taxicab rate
- **NY State Congestion Surcharge**: $2.50
- **Peak Commute Rush Hour**: +$1.50 (4:00 PM – 8:00 PM weekdays)
- **Overnight Surcharge**: +$0.75 (8:00 PM – 6:00 AM)
- **Airport Flat Surcharge / Tolls**: $70.00 flat fare for JFK International Airport trips.
- **Tip Calculator**: Instant 15%, 20%, 25% suggestions.

### 3. 📂 Batch CSV Predictor
- Drag and drop any `.csv` trip dataset to process thousands of predictions in parallel.
- Interactive data table preview with instant CSV export of predicted fares.

### 4. 📑 6 Interactive CRISP-DM Deep Dive Views
- **Phase 1 (Business)**: TLC pricing rules, ROI metrics, problem formulation.
- **Phase 2 (Data EDA)**: 24-hour ride volume & average fare distributions, passenger count breakdown, fare bin histogram.
- **Phase 3 (Data Prep)**: Haversine spherical vs. Manhattan grid formulas, bearing angle trigonometry, cyclical sine/cosine time encoding.
- **Phase 4 (Modeling)**: Architecture comparison cards, hyperparameter configs, trade-offs.
- **Phase 5 (Evaluation)**: Benchmark leaderboard, holdout metrics, Gini feature importance rankings.
- **Phase 6 (Deployment)**: REST API documentation, interactive Swagger UI link, and cURL snippets.

---

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm 9+

### 1. Install Python Backend Dependencies
```bash
pip install -r requirements.txt
```

### 2. Train Models & Generate Artifacts (Optional / Pre-trained)
```bash
python ml_pipeline/train.py
```

### 3. Run Automated Backend Tests
```bash
cd backend
python -m pytest test_api.py -v
```

### 4. Launch Full Application (Backend + Frontend Concurrently)
From `Assignment 1 Part 2/nyc-taxi-challenge`:
```bash
npm install
npm run dev
```

- **Frontend UI**: [http://localhost:5174](http://localhost:5174)
- **FastAPI REST Server**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/predict` | Single trip fare prediction with itemized breakdown & explanation |
| `POST` | `/api/predict/batch` | Bulk JSON array predictions |
| `POST` | `/api/predict/upload-csv` | Streaming batch inference from uploaded CSV file |
| `GET` | `/api/models/benchmark` | Comparative evaluation metrics across all 4 models |
| `GET` | `/api/eda/insights` | Dataset distributions and 24-hour commute trends |
| `GET` | `/api/features/importance` | Ranked feature importance list |
| `GET` | `/api/health` | Service liveness probe & model status |
