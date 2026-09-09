# 📊 Customer Segmentation & Multi-Algorithm Clustering Platform (CRISP-DM)

An end-to-end Machine Learning **Customer Segmentation & Clustering Platform** engineered under the **CRISP-DM (Cross-Industry Standard Process for Data Mining)** methodology.

Benchmarking **4 distinct unsupervised learning paradigms** (**K-Means++**, **DBSCAN**, **Agglomerative Hierarchical**, and **Gaussian Mixture Models (GMM)**), this platform analyzes 500 multi-attribute customer records (Demographics + E-Commerce RFM) and projects them into an interactive **2D/3D Principal Component Analysis (PCA)** scatter space with actionable persona marketing playbooks.

---

## 🌟 Key Highlights & Features

- **🔬 4 Unsupervised Clustering Paradigms**:
  - **K-Means++**: Centroid-based partitioning minimizing within-cluster inertia with smart seeding.
  - **DBSCAN**: Density-based spatial clustering isolating core high-density customer clusters from anomalous outlier spenders.
  - **Agglomerative Hierarchical**: Bottom-up dendrogram clustering with Ward variance-minimizing linkage.
  - **Gaussian Mixture Models (GMM)**: Probabilistic clustering via Expectation-Maximization (EM) providing soft assignment probabilities $P(C_k \mid x)$ and full covariance shapes.
- **📐 Principal Component Analysis (PCA)**:
  - 6-dimensional customer vectors (Annual Income, Spending Score, Age, Recency, Frequency, Monetary) projected onto 2D space retaining **79.7% of total variance** (PCA 1: 57.6%, PCA 2: 22.1%).
- **📈 Mathematical Evaluation Metrics**:
  - **Silhouette Score**: `0.3924` (Peak inter-cluster separation).
  - **Davies-Bouldin Index**: `1.0837` (Strong intra-cluster tightness).
  - **Calinski-Harabasz Index**: `360.47` (Variance ratio criterion).
  - **Elbow Inertia Inflection**: Clear elbow at $k = 5$.
- **🎯 5 Distinct Customer Behavioral Personas**:
  1. **VIP Champions** ($20\%$, High Income / High Spend) $\to$ White-glove service, loyalty multipliers, exclusive product drops.
  2. **Frugal Savers** ($20\%$, High Income / Low Spend) $\to$ Quality durability guarantees, premium value comparisons.
  3. **Careless Trendsetters** ($20\%$, Low Income / High Spend) $\to$ Flash sales, trending social media alerts, BNPL financing.
  4. **Budget Conscious** ($20\%$, Low Income / Low Spend) $\to$ Clearance coupons, bundle discounts, free shipping thresholds.
  5. **Balanced Mainstream** ($15\%$, Moderate Income / Spend) $\to$ Seasonal newsletters, cross-sell recommendations.
  6. **Outliers & Anomalies** ($5\%$, Extreme Spenders) $\to$ High-ticket surveys or fraud inspection.
- **⚡ Live Customer Classifier Simulator**:
  - Interactive sliders to classify any custom customer in real-time, displaying mapped persona, churn risk, campaign ROI potential, and GMM membership probabilities.
- **📊 Exploratory Data Analysis (EDA) Explorer**:
  - Correlation heatmaps, descriptive statistical quartiles, and interactive feature distribution histograms.

---

## 📐 CRISP-DM 6-Phase Lifecycle

```
+-------------------------------------------------------------------------------+
|                        CRISP-DM 6-PHASE METHODOLOGY                           |
+-------------------------------------------------------------------------------+
|  1. Business Understanding  --> Personalize marketing, boost LTV & ROI        |
|  2. Data Understanding      --> 500 customers (Demographics + E-Commerce RFM) |
|  3. Data Preparation        --> StandardScaler normalization & 2D PCA (79.7%) |
|  4. Modeling                --> K-Means, DBSCAN, Hierarchical, GMM Comparison  |
|  5. Evaluation              --> Silhouette (0.392), Davies-Bouldin, Elbow k=5 |
|  6. Deployment              --> FastAPI REST Microservice + React 19 UI       |
+-------------------------------------------------------------------------------+
```

---

## 📁 Repository Structure

```
Assignment 1 Part 2/customer-segmentation-clustering/
├── ml_engine/
│   ├── data_loader.py            # Generates customer dataset & computes EDA stats
│   ├── clustering.py             # K-Means, DBSCAN, Hierarchical, GMM, & PCA pipeline
│   ├── evaluator.py              # Persona heuristic generator & marketing strategies
│   ├── export_models.py          # Training pipeline & checkpoint exporter
│   └── checkpoints/
│       ├── customers.csv         # 500 customer records with RFM features
│       ├── clustering_report.json# Precomputed PCA coordinates & metrics
│       ├── eda_metrics.json      # Summary stats & correlation matrices
│       └── pipeline.pkl          # Pickled StandardScaler, PCA, and fitted models
├── backend/
│   ├── app.py                    # FastAPI server (/api/clustering/run, /api/cluster/predict)
│   ├── schemas.py                # Pydantic request/response data models
│   └── test_api.py               # Pytest automated test suite (11/11 passed)
├── frontend/
│   ├── src/
│   │   ├── api/client.ts         # REST API client
│   │   ├── types/index.ts        # TypeScript data definitions
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Navigation header with live status
│   │   │   ├── ClusterVisualizer.tsx  # 2D/3D Scatter Plot with PCA projections
│   │   │   ├── CustomerClassifier.tsx # Real-time customer segment predictor
│   │   │   ├── EdaExplorer.tsx        # Statistical distributions & correlations
│   │   │   ├── AdminDashboard.tsx     # Silhouette curves, elbow plot, personas
│   │   │   └── crisp_dm/              # 6 CRISP-DM methodology deep dive tabs
│   │   ├── App.tsx               # Root view router
│   │   └── main.tsx              # React DOM entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── requirements.txt              # Python dependencies (scikit-learn, fastapi, pandas)
├── package.json                  # Root monorepo scripts
└── README.md                     # Comprehensive documentation
```

---

## ⚡ Quick Start Guide

### 1. Install Python Dependencies
```bash
cd "Assignment 1 Part 2/customer-segmentation-clustering"
pip install -r requirements.txt
```

### 2. Run Automated Pytest Suite
```bash
cd backend
python -m pytest test_api.py -v
```

### 3. Run the ML Pipeline (Optional)
```bash
python ml_engine/export_models.py
```

### 4. Launch the FastAPI Backend Server
```bash
uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
```
Interactive Swagger docs available at `http://localhost:8000/docs`.

### 5. Launch the React Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5176` in your browser.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and algorithm inventory |
| `GET` | `/api/eda` | Summary statistics, histograms, and correlation matrices |
| `GET` | `/api/customers` | 500 customer records with PCA coordinates and cluster labels |
| `GET` | `/api/elbow/curves` | WCSS inertia and Silhouette scores across $k=2\dots 10$ |
| `GET` | `/api/personas` | Customer persona behavioral descriptions and marketing plans |
| `POST` | `/api/clustering/run` | Dynamically executes K-Means, DBSCAN, Hierarchical, or GMM |
| `POST` | `/api/cluster/predict` | Classifies any custom customer into their persona segment |
| `GET` | `/api/crisp-dm` | Complete 6-phase CRISP-DM lifecycle deliverables and KPIs |

---

## 📄 License & Monorepo
Part of the **Data Mining & CRISP-DM Assignment Suite**  
Repository: [https://github.com/ayushivishwassurange-wq/Data-Mining](https://github.com/ayushivishwassurange-wq/Data-Mining)
