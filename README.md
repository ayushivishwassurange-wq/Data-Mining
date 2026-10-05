# 🚀 Data Mining & Advanced Machine Learning Repository

[![CRISP-DM Standard](https://img.shields.io/badge/Methodology-CRISP--DM%206--Phase-purple.svg)](https://en.wikipedia.org/wiki/Cross-industry_standard_process_for_data_mining)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.2%2B-EE4C2C.svg?logo=pytorch)](https://pytorch.org)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Welcome to the comprehensive **Data Mining & Advanced Machine Learning** repository by **Ayushi Vishwas Surange**. This repository houses coursework, empirical machine learning research pipelines, production full-stack analytics dashboards, from-scratch deep learning models, serverless cloud implementations, and advanced AutoML/GPU data science masterclasses.

---

## 🗺️ Repository Overview & Navigation

```
Data-Mining/
├── Assignment 1/                       # Clinical Heart Disease Diagnostic Data Mining
│   ├── README.md                       # Comprehensive clinical ML pipeline documentation
│   ├── Heart_Disease_Analysis_Final.py # End-to-end data preparation, EDA & modeling
│   ├── raw_merged_heart_dataset.csv    # 5-source unified heart disease cohort (N=920)
│   ├── docs/                           # Assignment briefing & academic prompts
│   └── output/                         # ROC curves, feature importances, CSV matrices
│
├── Assignment 1 Part 2/                # 5 End-to-End CRISP-DM Machine Learning Platforms
│   ├── README.md                       # Master portfolio documentation & quickstart
│   ├── nyc-taxi-challenge/             # Supervised Regression (XGBoost, Leaflet Map)
│   ├── customer-segmentation-clustering/# Unsupervised Clustering (K-Means, GMM, PCA)
│   ├── market-basket-association-mining/# Frequent Pattern Mining (Apriori, FP-Growth)
│   ├── llm-chatbot-platform/           # From-Scratch PyTorch LLM (RoPE, SwiGLU, SSE)
│   └── fullstack-test/                 # Dynamic Workflow Engine (TaskFlow Pro)
│
├── notebooks/                          # Part 1: AI & Machine Learning Foundations
│   ├── README.md                       # Curriculum guide & mathematical index
│   └── *.ipynb                         # 16 Executed Google Colab / Jupyter notebooks
│
└── notebooks-part-2/                   # Part 2: Advanced ML, AutoML & GPU Data Science
    ├── README.md                       # Masterclass curriculum guide & video index
    └── *.ipynb                         # 6 Executed Google Colab / Jupyter notebooks
```

---

## 📚 Portfolio Sections

### 1. 🩺 Assignment 1 — Clinical Heart Disease Diagnostic Analysis
*Directory: [`Assignment 1/`](./Assignment%201/)* | *Documentation: [`Assignment 1/README.md`](./Assignment%201/README.md)*

A rigorous clinical data mining study conducted across the unified 5-source Heart Disease Cohort (**Cleveland, Hungarian, Switzerland, Long Beach VA, and Statlog**; $N=920$ patients across 14 standardized clinical attributes):
- **Exploratory Data Analysis & Statistical Testing**: Two-sample independent t-tests, Mann-Whitney U non-parametric checks, Pearson/Spearman correlation matrices, and Chi-Square tests of independence.
- **Classification Benchmark**: Evaluated Logistic Regression (L1/L2 ElasticNet penalty), Random Forest Ensemble (100 estimators, Gini criterion), and Decision Tree classifiers.
- **Diagnostic Evaluation**: ROC-AUC curves (peak 0.91), Precision-Recall frontiers, calibration curves, confusion matrices, and clinical feature importance attribution (Chest Pain Type, ST Depression, Fluoroscopy vessels, and Peak Exercise Heart Rate).

---

### 2. ⚡ Assignment 1 Part 2 — Full-Stack CRISP-DM Machine Learning Suite
*Directory: [`Assignment 1 Part 2/`](./Assignment%201%20Part%202/)* | *Documentation: [`Assignment 1 Part 2/README.md`](./Assignment%201%20Part%202/README.md)*

A suite of 5 production applications following the 6-phase **CRISP-DM** lifecycle (Business Understanding, Data Understanding, Data Preparation, Modeling, Evaluation, Deployment):

| Project | Paradigm & Algorithms | Key Performance Metrics | Tech Stack | Port |
| :--- | :--- | :--- | :--- | :---: |
| **[NYC Taxi Challenge](./Assignment%201%20Part%202/nyc-taxi-challenge)** | Supervised Regression (XGBoost, Random Forest, Ridge) | **RMSE: $1.659**<br>$R^2$: 0.9942, Latency: 0.0015ms | FastAPI, React 19, Leaflet | `8001` / `5174` |
| **[Customer Segmentation](./Assignment%201%20Part%202/customer-segmentation-clustering)** | Unsupervised Clustering (K-Means++, DBSCAN, GMM, Hierarchical) | **Silhouette: 0.392**<br>PCA Explained Var: 79.7% | FastAPI, React 19, Recharts | `8003` / `5176` |
| **[Market Basket Mining](./Assignment%201%20Part%202/market-basket-association-mining)** | Association Mining (Apriori, FP-Growth, ECLAT) | **Peak Lift: 5.05x**<br>FP-Growth 9x speedup | FastAPI, React 19, SVG Graph | `8004` / `5177` |
| **[Mini-LLM Chatbot](./Assignment%201%20Part%202/llm-chatbot-platform)** | From-Scratch Causal Transformer (RoPE, SwiGLU, RMSNorm) | **Loss: 0.0239**, PPL: 1.02<br>Latency: <5ms/token | FastAPI SSE, PyTorch, React 19 | `8002` / `5175` |
| **[TaskFlow Pro](./Assignment%201%20Part%202/fullstack-test)** | Fullstack Task Management (Kanban, Matrix, Calendar) | Natural Language Parser<br>Multi-Tab Real-time SSE | Express.js, React 19, Web Audio | `5000` / `5173` |

---

### 3. 🔬 AI & Machine Learning Foundations — Executed Notebooks (Part 1)
*Directory: [`notebooks/`](./notebooks/)* | *Documentation: [`notebooks/README.md`](./notebooks/README.md)*

A comprehensive curriculum of 16 pre-executed Google Colab notebooks exploring foundational mathematics, data engineering, and architectures that underpin modern AI and Deep Learning:
- **Data Engineering Foundations**: NumPy n-dimensional tensors, broadcasting, vectorization, and pandas data manipulation & cleaning.
- **Scientific Visualization**: Matplotlib artist tree architecture, coordinate transformations, and GridSpec multi-panel layouts.
- **Mathematical Foundations**: Linear transformations, dot product projections, eigenvalues/PCA, multivariate gradients, chain rule backpropagation, probability distributions, Bayes' Theorem, MLE, and statistical hypothesis testing.

---

### 4. 🚀 Advanced Machine Learning, AutoML & GPU Data Science — Executed Notebooks (Part 2)
*Directory: [`notebooks-part-2/`](./notebooks-part-2/)* | *Documentation: [`notebooks-part-2/README.md`](./notebooks-part-2/README.md)*

An advanced curriculum of 6 pre-executed Google Colab masterclass notebooks covering state-of-the-art AutoML ensembling, GPU data science acceleration, mathematical clustering, and production MLOps:

| # | Masterclass Module | Core Architectural & Engineering Competencies | Notebook Link | Video Walkthrough |
| :-: | :--- | :--- | :---: | :---: |
| **01** | **AutoGluon: Capabilities Tour** | Multi-problem AutoML (11 problem types), 3-line paradigm, pinball loss quantile delivery windows, cost-sensitive fraud thresholds, zero-shot Amazon Chronos time series, multimodal transformer fusion (BERT-tiny + Tabular MLPs), vision defect classification (MobileNetV3), semantic search embeddings, and Tabular Foundation Models (TabPFN). | [Open Notebook](./notebooks-part-2/final_autogluon_capabilities_tour.ipynb) | [▶️ Watch Video](https://www.youtube.com/watch?v=dmNLMn_HaNw) |
| **02** | **AutoGluon: Zero to Hero** | The AutoML lifecycle, naive baselines rule, multi-layer stacking mechanics without data leakage via out-of-fold (OOF) cross-validation, probability calibration (reliability curves), feature leakage diagnostics, model distillation into lightweight LightGBM student models (Pareto latency frontier), and Population Stability Index (PSI) drift monitoring. | [Open Notebook](./notebooks-part-2/final_autogluon_zero_to_hero.ipynb) | [▶️ Watch Video](https://www.youtube.com/watch?v=zmL1LjBRIqE) |
| **03** | **K-Means Clustering: Zero to Hero** | Mathematical derivation of Lloyd's algorithm from scratch in raw NumPy (assignment & centroid updates), Voronoi cell geometry, failure of random initialization, $D(x)^2$ sampling proof of K-Means++, choosing $K$ (Elbow curve, Silhouette knife-blade plots, Gap statistic), 3 textbook failure cases, RFM customer segmentation, 16M-color quantization, surrogate decision trees, and multimodal LLM cluster naming. | [Open Notebook](./notebooks-part-2/final_kmeans_zero_to_hero.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_KMEANS_VIDEO_ID) |
| **04** | **NVIDIA RAPIDS: Zero to Hero** | GPU data science architecture (Tesla T4), memory bandwidth vs. CPU core scaling, Apache Arrow columnar GPU memory, zero-code acceleration via `%load_ext cudf.pandas`, cuML drop-in Scikit-Learn algorithms (50x Random Forest & UMAP acceleration), unified memory (UVM) spilling, Dask-cuDF multi-million row out-of-core scaling, GPU XGBoost with GPU TreeSHAP, and cuGraph network analytics. | [Open Notebook](./notebooks-part-2/final_nvidia_rapids_zero_to_hero.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_RAPIDS_VIDEO_ID) |
| **05** | **PyCaret: Capabilities Tour** | Low-code end-to-end ML lifecycle, `setup()` automatic pipeline creation, 15-model cross-validation benchmarking (`compare_models()`), continuous regression with residual diagnostics, one-line ensembling (tuning, bagging, boosting, blending, stacking), leak-free SMOTE imbalanced learning, unsupervised clustering & Isolation Forest anomaly detection, and time-series forecasting with exogenous promotions. | [Open Notebook](./notebooks-part-2/final_pycaret_capabilities_tour.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_PYCARET_TOUR_VIDEO_ID) |
| **06** | **PyCaret: Zero to Hero** | Low-code vs. hand-built Scikit-Learn pipelines, exhaustive `setup()` preprocessing engine (imputation, multicollinearity removal, encoding), Expected Calibration Error (ECE), financial cost-aware decision thresholding, subtle feature leakage traps and feature attribution diagnostics, local SHAP reason codes for FCRA compliance, fairness audits, and automated retraining pipelines. | [Open Notebook](./notebooks-part-2/final_pycaret_zero_to_hero.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_PYCARET_ZTH_VIDEO_ID) |

---

## ⚡ Quickstart

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm 9+

### Clone & Install
```bash
git clone https://github.com/ayushivishwassurange-wq/Data-Mining.git
cd Data-Mining

# Setup virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1   # Windows
source venv/bin/activate       # Linux/macOS
```

To run any individual project, refer to the step-by-step instructions in [`Assignment 1 Part 2/README.md`](./Assignment%201%20Part%202/README.md).

---

## 📜 License & Attribution
Author: **Ayushi Vishwas Surange**  
Academic Coursework: Data Mining & Advanced Machine Learning  
All source code and documentation released under the [MIT License](https://opensource.org/licenses/MIT).
