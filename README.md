# 🧠 Data Mining & Advanced Machine Learning Repository

[![CRISP-DM Standard](https://img.shields.io/badge/Methodology-CRISP--DM%206--Phase-purple.svg)](https://en.wikipedia.org/wiki/Cross-industry_standard_process_for_data_mining)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.2%2B-EE4C2C.svg?logo=pytorch)](https://pytorch.org)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Welcome to the comprehensive **Data Mining & Advanced Machine Learning** repository by **Ayushi Vishwas Surange**. This repository houses coursework, empirical machine learning research pipelines, production full-stack analytics dashboards, from-scratch deep learning models, and serverless cloud implementations.

---

## 🏛️ Repository Overview & Navigation

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
│   ├── nyc-taxi-challenge/             # 🚕 Supervised Regression (XGBoost, Leaflet Map)
│   ├── customer-segmentation-clustering/# 📊 Unsupervised Clustering (K-Means, GMM, PCA)
│   ├── market-basket-association-mining/# 🛒 Frequent Pattern Mining (Apriori, FP-Growth)
│   ├── llm-chatbot-platform/           # 🧠 From-Scratch PyTorch LLM (RoPE, SwiGLU, SSE)
│   └── fullstack-test/                 # ⚡ Dynamic Workflow Engine (TaskFlow Pro)
│
└── notebooks/                          # 📓 AI & Machine Learning Foundations
    ├── README.md                       # Complete curriculum guide & mathematical index
    └── *.ipynb                         # 16 Executed Google Colab / Jupyter notebooks
```

---

## 📑 Portfolio Sections

### 1. 🫀 Assignment 1 — Clinical Heart Disease Diagnostic Analysis
*Directory: [`Assignment 1/`](./Assignment%201/)* | *Documentation: [`Assignment 1/README.md`](./Assignment%201/README.md)*

A rigorous clinical data mining study conducted across the unified 5-source Heart Disease Cohort (**Cleveland, Hungarian, Switzerland, Long Beach VA, and Statlog**; $N=920$ patients across 14 standardized clinical attributes):
- **Exploratory Data Analysis & Statistical Testing**: Two-sample independent t-tests, Mann-Whitney U non-parametric checks, Pearson/Spearman correlation matrices, and Chi-Square tests of independence.
- **Classification Benchmark**: Evaluated Logistic Regression (L1/L2 ElasticNet penalty), Random Forest Ensemble (100 estimators, Gini criterion), and Decision Tree classifiers.
- **Diagnostic Evaluation**: ROC-AUC curves (peak 0.91), Precision-Recall frontiers, calibration curves, confusion matrices, and clinical feature importance attribution (Chest Pain Type, ST Depression, Fluoroscopy vessels, and Peak Exercise Heart Rate).

---

### 2. 🚀 Assignment 1 Part 2 — Full-Stack CRISP-DM Machine Learning Suite
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

### 3. 📓 AI & Machine Learning Foundations — Executed Notebooks
*Directory: [`notebooks/`](./notebooks/)* | *Documentation: [`notebooks/README.md`](./notebooks/README.md)*

A comprehensive curriculum of 16 pre-executed Google Colab notebooks exploring foundational mathematics, data engineering, and architectures that underpin modern AI and Deep Learning:
- **Data Engineering Foundations**: NumPy n-dimensional tensors, broadcasting, vectorization, and pandas data manipulation & cleaning.
- **Scientific Visualization**: Matplotlib artist tree architecture, coordinate transformations, and GridSpec multi-panel layouts.
- **Mathematical Foundations**: Linear transformations, dot product projections, eigenvalues/PCA, multivariate gradients, chain rule backpropagation, probability distributions, Bayes' Theorem, MLE, and statistical hypothesis testing.

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

## 📄 License & Attribution
Author: **Ayushi Vishwas Surange**  
Academic Coursework: Data Mining & Advanced Machine Learning  
All source code and documentation released under the [MIT License](https://opensource.org/licenses/MIT).
