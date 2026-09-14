# 🚀 Data Mining & Advanced Machine Learning Portfolio
## Assignment 1 Part 2 — End-to-End CRISP-DM Machine Learning Applications



[![CRISP-DM Standard](https://img.shields.io/badge/Methodology-CRISP--DM%206--Phase-purple.svg)](https://en.wikipedia.org/wiki/Cross-industry_standard_process_for_data_mining)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.2%2B-EE4C2C.svg?logo=pytorch)](https://pytorch.org)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)
[![Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

> **Author**: Ayushi Vishwas Surange  
> **Course**: Data Mining & Advanced Machine Learning  
> **Framework**: Cross-Industry Standard Process for Data Mining (CRISP-DM)  
> **Interactive Presentation**: Open [`../presentation.html`](../presentation.html) in any modern web browser or view [`../Data_Mining_Assignment_1_Part_2_Presentation.pptx`](../Data_Mining_Assignment_1_Part_2_Presentation.pptx).

---

## 📑 Table of Contents
1.[Youtube Video](#youtube)
2.  [Executive Summary](#-executive-summary)
3. [CRISP-DM 6-Phase Architecture](#-crisp-dm-6-phase-architecture)
4. [Unified Project Matrix](#-unified-project-matrix)
5. [Project Deep Dives](#-project-deep-dives)
   - [1. NYC Taxi Challenge (Supervised Regression)](#1--nyc-taxi-challenge--crisp-dm-regression-platform)
   - [2. Customer Segmentation (Unsupervised Clustering)](#2--customer-segmentation--multi-algorithm-clustering-platform)
   - [3. Market Basket Mining (Frequent Patterns & Rules)](#3--market-basket--associative-pattern-mining-platform)
   - [4. Mini-LLM & Chatbot (From-Scratch Deep Learning)](#4--mini-llm--generative-chatbot-platform)
   - [5. TaskFlow Pro (Full-Stack Workflow System)](#5--taskflow-pro--modern-dynamic-workflow-system)
6. [Quickstart & Port Matrix](#-quickstart--port-matrix)
7. [Testing & Quality Assurance](#-testing--quality-assurance)
8. [Repository Structure](#-repository-structure)

---
##Youtube Walkthrough
[][Youtube walkthrough]:(https://www.youtube.com/watch?v=E0j3J0QEw4w)

## 🌟 Executive Summary

**Assignment 1 Part 2** presents a comprehensive data mining portfolio of **5 production-grade, full-stack applications**. Each system rigorously follows the 6 phases of the **CRISP-DM** lifecycle (Business Understanding, Data Understanding, Data Preparation, Modeling, Evaluation, and Deployment), bridging algorithmic data mining theory with modern, interactive web interfaces.

The portfolio spans five core data mining disciplines:
1. **Supervised Spatial Regression**: Predicting dynamic transit fares using Gradient Boosted Decision Trees (XGBoost) with sub-2ms inference.
2. **Unsupervised Clustering & Dimensionality Reduction**: Segmenting multi-attribute customer records using K-Means++, DBSCAN, Hierarchical, and Gaussian Mixture Models with 2D/3D PCA.
3. **Frequent Pattern Mining & Association Rules**: Unearthing hidden co-purchase synergies using Apriori, FP-Growth, and ECLAT algorithms with interactive graph topologies.
4. **Deep Learning Generative NLP**: Designing and training a 4-layer Causal Decoder-Only Transformer with modern primitives (RoPE, SwiGLU, RMSNorm) providing sub-5ms local token streaming.
5. **Full-Stack Dynamic Workflow Orchestration**: Engineering a production-grade task and productivity suite with natural language parsing and Server-Sent Events (SSE).

---

## 🏛️ CRISP-DM 6-Phase Architecture

Every project in this portfolio maps directly to the standard CRISP-DM lifecycle:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CRISP-DM 6-PHASE METHODOLOGY                       │
├───────────────────────────────────┬─────────────────────────────────────────┤
│ 1. Business Understanding         │ Domain KPIs, ROI goals, SLA constraints │
│ 2. Data Understanding             │ Exploratory Data Analysis, distributions│
│ 3. Data Preparation               │ Spatial trig, cyclical time, PCA, one-hot│
│ 4. Modeling                       │ XGBoost, GMM, FP-Growth, Transformers   │
│ 5. Evaluation                     │ RMSE, Silhouette, Lift, Perplexity, F1  │
│ 6. Deployment                     │ FastAPI SSE, async REST, React 19 UI    │
└───────────────────────────────────┴─────────────────────────────────────────┘
```

---

## 📊 Unified Project Matrix

| Project | Domain | Core Algorithms | Primary Metrics | Backend Tech | Frontend Tech | Backend Port | Frontend Port |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **[NYC Taxi Challenge](./nyc-taxi-challenge)** | Supervised Regression | XGBoost, Random Forest, Ridge, OLS | **RMSE: $1.659**<br>$R^2$: 0.9942 | FastAPI | React 19 + Leaflet | `8001` | `5174` |
| **[Customer Segmentation](./customer-segmentation-clustering)** | Unsupervised Clustering | K-Means++, DBSCAN, Hierarchical, GMM | **Silhouette: 0.392**<br>PCA Var: 79.7% | FastAPI | React 19 + Recharts | `8003` | `5176` |
| **[Market Basket Mining](./market-basket-association-mining)** | Association Mining | Apriori, FP-Growth, ECLAT | **Peak Lift: 5.05x**<br>Latency: 10ms | FastAPI | React 19 + SVG Graph | `8004` | `5177` |
| **[Mini-LLM Chatbot](./llm-chatbot-platform)** | Generative NLP | Causal Transformer (RoPE, SwiGLU) | **Loss: 0.0239**<br>Perplexity: 1.02 | FastAPI + PyTorch | React 19 + SSE | `8002` | `5175` |
| **[TaskFlow Pro](./fullstack-test)** | Workflow Systems | NLP Chrono Parser, Eisenhower Matrix | Sub-5ms latency<br>SSE multi-tab | Express.js | React 19 + Web Audio | `5000` | `5173` |

---

## 🔬 Project Deep Dives

### 1. 🚕 NYC Taxi Challenge — CRISP-DM Regression Platform
*Directory: [`nyc-taxi-challenge/`](./nyc-taxi-challenge)*

An end-to-end data science application based on the Kaggle NYC Taxi Fare Prediction Challenge, operationalizing real-time fare inference with sub-2ms latency.

- **Data Preparation**: Spherical Haversine distance, Manhattan grid distance, compass bearing angles ($\theta = \text{atan2}$), cyclical sine/cosine time encoding, JFK/LGA/EWR airport perimeter radii.
- **Model Leaderboard**:
  - 🏆 **XGBoost Regressor**: **RMSE $1.659**, **MAE $1.175**, **$R^2$ 0.9942**, Train Time 0.62s
  - Random Forest Regressor: RMSE $1.711, $R^2$ 0.9938
  - Linear Regression (Baseline): RMSE $3.714, $R^2$ 0.9710
- **Interactive Features**:
  - Leaflet Map with draggable 🟢 Pickup and 🔴 Dropoff pins across NYC boroughs.
  - Official NYC TLC Fare itemization (Flag drop $3.00, Congestion Surcharge $2.50, Peak Rush Hour $1.50, Overnight Surcharge $0.75, JFK Flat $70.00).
  - Batch CSV Inference with live tabular preview and instant export.
  - 6 dedicated CRISP-DM inspection tabs.

---

### 2. 📊 Customer Segmentation & Multi-Algorithm Clustering Platform
*Directory: [`customer-segmentation-clustering/`](./customer-segmentation-clustering)*

An enterprise customer intelligence platform analyzing multi-attribute customer vectors (Demographics + E-Commerce RFM Recency, Frequency, Monetary metrics).

- **Clustering Paradigms**:
  - **K-Means++**: Centroid-based partitioning minimizing within-cluster inertia ($k=5$).
  - **DBSCAN**: Density-based clustering isolating core clusters from anomalous spenders ($\epsilon=0.8, \text{min\_samples}=5$).
  - **Agglomerative Hierarchical**: Bottom-up dendrogram with Ward minimum-variance linkage.
  - **Gaussian Mixture Models (GMM)**: Probabilistic soft assignments $P(C_k \mid x)$ via Expectation-Maximization.
- **Dimensionality Reduction & Validation**:
  - 2D/3D PCA projection capturing **79.7% of total variance** (PCA 1: 57.6%, PCA 2: 22.1%).
  - Silhouette Score: `0.3924`, Davies-Bouldin Index: `1.0837`, Calinski-Harabasz: `360.47`.
- **5 Behavioral Personas**: VIP Champions, Frugal Savers, Careless Trendsetters, Budget Conscious, Balanced Mainstream.
- **Live Simulator**: Interactive feature sliders to classify any customer vector in real-time with churn risk and campaign ROI forecasts.

---

### 3. 🛒 Market Basket & Associative Pattern Mining Platform
*Directory: [`market-basket-association-mining/`](./market-basket-association-mining)*

A retail analytics suite that unearths hidden co-purchasing patterns and powers an automated cross-sell recommendation engine.

- **Tri-Algorithm Engine**:
  - **Apriori**: Classical level-wise candidate generation with anti-monotone pruning (~242ms).
  - **FP-Growth**: Compressed prefix-tree with conditional pattern bases (~27ms, 9x speedup).
  - **ECLAT**: Equivalence Class Clustering with vertical bitwise Tidset intersections (~10ms, 24x speedup).
- **Metric Evaluation**: Generates association rules scoring Support, Confidence, Lift (peak 5.05x), Leverage, Conviction, and Zhang's Metric.
- **Interactive Visualizations**:
  - Force-Directed SVG Network Graph showing product clustering topology and rule strength glow.
  - Metric scatter plots (Support vs. Confidence vs. Lift).
  - Live Smart Cart Simulator: Real-time dynamic bundle discounts and cross-sell recommendation cards.

---

### 4. 🧠 Mini-LLM & Generative Chatbot Platform
*Directory: [`llm-chatbot-platform/`](./llm-chatbot-platform)*

An end-to-end generative language model designed, tokenized, and trained from scratch in **PyTorch**, executing locally on CPU/GPU with **zero external API fees** and sub-5ms token streaming.

- **Modern Architecture Primitives**:
  - **Rotary Position Embeddings (RoPE)**: Relative position encoding via 2D rotation matrices for long-context sequence extrapolation.
  - **SwiGLU Feed-Forward**: $\text{SwiGLU}(x) = (\text{SiLU}(x W_{\text{gate}}) \odot x W_{\text{up}}) W_{\text{down}}$.
  - **RMSNorm**: Root Mean Square layer normalization without mean-centering for fast gradient backpropagation.
  - **Causal Multi-Head Self-Attention**: Lower-triangular masked attention preventing token lookahead leakage.
  - **Weight Tying**: Shared embeddings between token input and language model output projection head.
- **Model Specs**: 4 Layers, 4 Attention Heads, $d_{\text{model}} = 128$, Context Window = 128, 884k trainable parameters.
- **Interactive Features**:
  - Streaming Chat Studio via Server-Sent Events (SSE) with configurable Temperature, Top-$K$, and Nucleus Top-$P$.
  - 4x4 Attention Heatmap Visualizer for layer-by-layer Query-Key inspection.
  - MiniTokenizer Subword Sandbox with live token breakdown and compression ratios.
  - On-Device Interactive Fine-Tuning widget for instant in-browser AdamW gradient updates.

---

### 5. ⚡ TaskFlow Pro — Modern Dynamic Workflow System
*Directory: [`fullstack-test/`](./fullstack-test)*

A production-grade, highly responsive task orchestration application engineered with modern UX inspired by Linear, Things 3, and Notion.

- **5 Dynamic Workflow Views**:
  - **List View**: Customizable grouping (Status, Priority, Category, Due Date) with drag-and-drop reordering.
  - **Kanban Board**: 4-column agile workflow (`To Do`, `In Progress`, `Under Review`, `Completed`).
  - **Calendar View**: Monthly interactive grid with date-click scheduling.
  - **Eisenhower Matrix**: 4-quadrant prioritization grid (`Do First`, `Schedule`, `Delegate`, `Eliminate`).
  - **Productivity & Streak Dashboard**: 7-day velocity charts, streak counter, and completion gauge.
- **Power-User Features**:
  - Global Command Palette (`Ctrl+K` / `Cmd+K`).
  - Natural Language Smart Input: `Deploy release candidate tomorrow at 4pm !urgent #devops @work ~45m`.
  - Focus Pomodoro Timer directly linked to tasks.
  - Server-Sent Events (SSE) real-time multi-tab state synchronization.
  - Web Audio API synthesizer clicks and confetti celebration effects.

---

## ⚡ Quickstart & Port Matrix

All 5 platforms are pre-configured with distinct network ports so that you can launch and run all of them concurrently on the same machine without port conflicts.

### Unified Port Mapping

| Service / Project | Backend Command | Backend URL | Frontend Dev URL |
| :--- | :--- | :--- | :--- |
| **NYC Taxi Challenge** | `npm run dev:backend` (in `nyc-taxi-challenge`) | `http://localhost:8001` | `http://localhost:5174` |
| **Mini-LLM Chatbot** | `npm run dev:backend` (in `llm-chatbot-platform`) | `http://localhost:8002` | `http://localhost:5175` |
| **Customer Segmentation** | `npm run dev:backend` (in `customer-segmentation-clustering`) | `http://localhost:8003` | `http://localhost:5176` |
| **Market Basket Mining** | `npm run dev:backend` (in `market-basket-association-mining`) | `http://localhost:8004` | `http://localhost:5177` |
| **TaskFlow Pro** | `npm run dev:backend` (in `fullstack-test`) | `http://localhost:5000` | `http://localhost:5173` |

---

### Step-by-Step Launch Instructions

#### 1. Setup Python Virtual Environment
```bash
# From workspace root
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# Linux/macOS:
source venv/bin/activate
```

#### 2. Running NYC Taxi Challenge
```bash
cd "Assignment 1 Part 2/nyc-taxi-challenge"
pip install -r requirements.txt
cd frontend && npm install && cd ..
npm run dev
# Backend running at http://localhost:8001, Frontend at http://localhost:5174
```

#### 3. Running Customer Segmentation
```bash
cd "Assignment 1 Part 2/customer-segmentation-clustering"
pip install -r requirements.txt
cd frontend && npm install && cd ..
# Run ML pipeline export (optional, pre-cached):
python ml_engine/export_models.py
# Start backend and frontend:
uvicorn backend.app:app --port 8003 --reload
cd frontend && npm run dev
# Backend running at http://localhost:8003, Frontend at http://localhost:5176
```

#### 4. Running Market Basket Mining
```bash
cd "Assignment 1 Part 2/market-basket-association-mining"
pip install -r requirements.txt
cd frontend && npm install && cd ..
# Start backend and frontend:
uvicorn backend.app:app --port 8004 --reload
cd frontend && npm run dev
# Backend running at http://localhost:8004, Frontend at http://localhost:5177
```

#### 5. Running Mini-LLM Chatbot Platform
```bash
cd "Assignment 1 Part 2/llm-chatbot-platform"
pip install -r requirements.txt
cd frontend && npm install && cd ..
# Optional: train from scratch (pre-trained checkpoint included):
python ml_engine/train.py
# Start backend and frontend:
uvicorn backend.app:app --port 8002 --reload
cd frontend && npm run dev
# Backend running at http://localhost:8002, Frontend at http://localhost:5175
```

#### 6. Running TaskFlow Pro
```bash
cd "Assignment 1 Part 2/fullstack-test"
npm run install:all
npm run dev
# Backend running at http://localhost:5000, Frontend at http://localhost:5173
```

---

## 🧪 Testing & Quality Assurance

Comprehensive automated unit and regression test suites are implemented using `pytest` across all backend services:

```bash
# Test NYC Taxi backend endpoints & feature engineering:
pytest "Assignment 1 Part 2/nyc-taxi-challenge/backend/test_api.py" -v

# Test Customer Segmentation clustering algorithms & PCA projection:
pytest "Assignment 1 Part 2/customer-segmentation-clustering/backend/test_api.py" -v

# Test Market Basket pattern mining, FP-Growth, and association rules:
pytest "Assignment 1 Part 2/market-basket-association-mining/backend/test_api.py" -v

# Test Mini-LLM transformer forward pass, RoPE, SwiGLU, and tokenizer:
pytest "Assignment 1 Part 2/llm-chatbot-platform/backend/test_api.py" -v
```

---

## 📂 Repository Structure

```
Assignment 1 Part 2/
├── README.md                                 # Master Portfolio Documentation (This File)
│
├── nyc-taxi-challenge/                       # Project 1: Supervised Regression Platform
│   ├── README.md                             # Detailed project documentation
│   ├── ml_pipeline/                          # Feature engineering, model training, Kaggle pipeline
│   ├── backend/                              # FastAPI REST API (Port 8001), schemas, test_api.py
│   └── frontend/                             # React 19 UI, Leaflet map, CRISP-DM tabs (Port 5174)
│
├── customer-segmentation-clustering/         # Project 2: Unsupervised Clustering Platform
│   ├── README.md                             # Detailed project documentation
│   ├── ml_engine/                            # K-Means++, DBSCAN, Hierarchical, GMM, PCA engines
│   ├── backend/                              # FastAPI REST API (Port 8003), schemas, test_api.py
│   └── frontend/                             # React 19 UI, Recharts PCA scatter, Persona playbooks (Port 5176)
│
├── market-basket-association-mining/         # Project 3: Pattern Mining & Recommendation Platform
│   ├── README.md                             # Detailed project documentation
│   ├── ml_engine/                            # Apriori, FP-Growth, ECLAT miners, rule generators
│   ├── backend/                              # FastAPI REST API (Port 8004), schemas, test_api.py
│   └── frontend/                             # React 19 UI, SVG Network graph, Smart cart simulator (Port 5177)
│
├── llm-chatbot-platform/                     # Project 4: From-Scratch Causal Transformer Platform
│   ├── README.md                             # Detailed project documentation
│   ├── ml_engine/                            # RoPE, SwiGLU, RMSNorm, Attention, MiniTokenizer, Trainer
│   ├── backend/                              # FastAPI SSE streaming server (Port 8002), test_api.py
│   └── frontend/                             # React 19 UI, Attention heatmaps, Tokenizer sandbox (Port 5175)
│
└── fullstack-test/                           # Project 5: Dynamic Fullstack Workflow Platform
    ├── README.md                             # Detailed project documentation
    ├── backend/                              # Express.js REST API with SSE live sync (Port 5000)
    └── frontend/                             # React 19 UI, Kanban, Calendar, Pomodoro timer (Port 5173)
```
