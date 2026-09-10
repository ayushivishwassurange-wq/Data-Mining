# 🛒 Market Basket & Associative Pattern Mining Platform
> **End-to-End Retail Pattern Mining, Rule Generation & Cross-Sell Recommender Engine following the CRISP-DM Framework**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg?style=flat&logo=python)](https://python.org)
[![CRISP-DM](https://img.shields.io/badge/Standard-CRISP--DM%206--Phase-purple.svg)](https://en.wikipedia.org/wiki/Cross-industry_standard_process_for_data_mining)
[![Tests](https://img.shields.io/badge/Tests-10%20Passing-brightgreen.svg)]()

---

## 🌟 Executive Overview

The **Market Basket & Associative Pattern Mining Platform** is a full-stack, production-grade analytics and recommendation suite built on top of canonical retail transaction datasets. It unearths hidden co-purchasing patterns, evaluates non-trivial product synergies, and exposes an interactive data science administration dashboard and real-time smart shopping cart recommender.

### Key Highlights
- **Tri-Algorithm Engine**: Full custom implementations of **Apriori** (candidate generation & anti-monotone pruning), **FP-Growth** (compressed prefix-tree with conditional pattern bases), and **ECLAT** (vertical Tidsets bitwise intersection).
- **Comprehensive Metric Suite**: Association rule generation scoring **Support**, **Confidence**, **Lift** (peak 5.05x), **Leverage**, **Conviction**, and **Zhang's Metric**.
- **CRISP-DM 6-Phase Lifecycle**: Structured business understanding, data exploration, one-hot transaction encoding, tree/graph modeling, statistical validation, and deployment operations.
- **Interactive Visualizations**:
  - **Directed Network Graph**: SVG force-directed topology where node size reflects item degree centrality and edge thickness/glow denotes rule Lift.
  - **Rule Explorer**: Metric filterable table with interactive Support vs. Confidence vs. Lift scatter plot matrix.
  - **Live Shopping Cart Simulator**: Real-time cross-sell uplifts, top-k synergy recommendations, and automatic smart promotional bundle coupon generation.
  - **Algorithm Benchmark Visualizer**: Sub-millisecond latency comparisons across dataset density configurations.

---

## 📐 Mathematical Formulation of Association Rules

An association rule is an implication of the form:
$$\text{Antecedent } (A) \implies \text{Consequent } (B), \quad \text{where } A \cap B = \emptyset$$

| Metric | Formula | Interpretation |
| :--- | :--- | :--- |
| **Support** | $\text{supp}(A \cup B) = \frac{\sigma(A \cup B)}{\|T\|}$ | Frequency of itemset $A \cup B$ across all transactions. |
| **Confidence** | $\text{conf}(A \implies B) = \frac{\text{supp}(A \cup B)}{\text{supp}(A)} = P(B \mid A)$ | Probability that item $B$ is purchased given $A$ is in the basket. |
| **Lift** | $\text{lift}(A \implies B) = \frac{\text{conf}(A \implies B)}{\text{supp}(B)} = \frac{P(A \cap B)}{P(A) \cdot P(B)}$ | Strength of the rule over random co-occurrence ($> 1$ indicates synergy). |
| **Leverage** | $\text{lev}(A \implies B) = \text{supp}(A \cup B) - \text{supp}(A) \cdot \text{supp}(B)$ | Difference between observed and expected joint probability under independence. |
| **Conviction** | $\text{conv}(A \implies B) = \frac{1 - \text{supp}(B)}{1 - \text{conf}(A \implies B)}$ | Measures the degree of implication ($> 1$ implies strong dependency). |

---

## ⚡ Algorithm Benchmark Comparison

Tested on 1,000 transactions across 33 catalog SKUs at **3.0% minimum support**:

| Algorithm | Strategy | Runtimes | Memory / Database Passes | Key Advantage |
| :--- | :--- | :--- | :--- | :--- |
| **Apriori** | Level-wise candidate generation | **~242 ms** | $k$ database scans, large candidate arrays | Simple, intuitive anti-monotone pruning |
| **FP-Growth** | Compressed FP-Tree & conditional trees | **~27 ms** (9x faster) | Exactly 2 scans, memory-compact tree | No candidate generation needed |
| **ECLAT** | Vertical Tidsets (TID lists) | **~10 ms** (24x faster) | In-memory TID set intersections | Blazing fast for dense datasets |

---

## 🏗️ Architecture Overview

```
market-basket-association-mining/
├── ml_engine/                      # Machine Learning & Mining Core
│   ├── data_loader.py              # Retail dataset generator & co-occurrence matrix
│   ├── miners.py                   # Apriori, FP-Growth, ECLAT & Rule Generation
│   ├── recommender.py              # Cart inference engine & bundle discounts
│   ├── export_models.py            # Model training & checkpoint generator
│   └── checkpoints/                # Serialized models & analytical metrics
│       ├── mining_report.json
│       ├── transactions.json
│       ├── eda_metrics.json
│       └── miners.pkl
├── backend/                        # High-Performance FastAPI Application
│   ├── app.py                      # RESTful endpoints & CORS routing
│   ├── schemas.py                  # Pydantic validation models
│   └── test_api.py                 # Automated pytest suite (10/10 passing)
├── frontend/                       # React 19 + TypeScript + Tailwind CSS UI
│   ├── src/
│   │   ├── api/client.ts           # Axios / Fetch client
│   │   ├── types/index.ts          # TypeScript interfaces
│   │   ├── components/
│   │   │   ├── Navbar.tsx          # Navigation & Dark Mode
│   │   │   ├── AdminDashboard.tsx  # KPI cards, hyperparameter tuning & CRISP-DM
│   │   │   ├── EdaExplorer.tsx     # Item distributions & co-occurrence matrix
│   │   │   ├── RuleExplorer.tsx    # Filterable rules table & scatter matrix
│   │   │   ├── NetworkGraphVisualizer.tsx # SVG Force-directed directed graph
│   │   │   ├── BasketRecommender.tsx      # Live cart simulator & bundle offers
│   │   │   └── crisp_dm/           # 6 CRISP-DM Phase Components
│   │   ├── App.tsx                 # Root application container
│   │   └── main.tsx                # React DOM entrypoint
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
├── requirements.txt                # Python backend dependencies
├── package.json                    # Root workspace orchestration scripts
└── README.md                       # Comprehensive documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup & Mining Engine Execution
```bash
# Navigate to project root
cd "Assignment 1 Part 2/market-basket-association-mining"

# Install Python dependencies
pip install -r requirements.txt

# Run model mining & export checkpoints
python ml_engine/export_models.py

# Run automated test suite
pytest backend/test_api.py -v

# Start FastAPI backend server (port 8000)
uvicorn backend.app:app --reload --port 8000
```

### 2. Frontend Setup & Launch
```bash
# In another terminal window:
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status & checkpoint verification |
| `GET` | `/api/eda` | Top items, basket size distribution & co-occurrences |
| `GET` | `/api/crisp-dm` | Structured CRISP-DM 6-phase metadata |
| `POST` | `/api/rules/mine` | Dynamic rule re-mining with custom support & confidence |
| `POST` | `/api/recommend/basket` | Real-time cross-sell recommendations for active cart |
| `GET` | `/api/network/graph` | Directed association graph nodes, links & centrality |
| `GET` | `/api/benchmark/speed` | Apriori vs FP-Growth vs ECLAT execution runtimes |
| `GET` | `/api/frequent/itemsets` | Mined frequent itemsets ranked by support |

---

## 🧪 Automated Testing
Run the Pytest suite covering all API endpoints and inference pipelines:
```bash
pytest backend/test_api.py -v
```
Output:
```
backend/test_api.py::test_health_endpoint PASSED
backend/test_api.py::test_eda_endpoint PASSED
backend/test_api.py::test_crisp_dm_endpoint PASSED
backend/test_api.py::test_rules_mine_endpoint PASSED
backend/test_api.py::test_rules_filter_pagination PASSED
backend/test_api.py::test_basket_recommend_endpoint PASSED
backend/test_api.py::test_basket_recommend_empty PASSED
backend/test_api.py::test_network_graph_endpoint PASSED
backend/test_api.py::test_benchmark_endpoint PASSED
backend/test_api.py::test_frequent_itemsets_endpoint PASSED

======================== 10 passed in 1.13s ========================
```

---

## 👩‍💻 Author
**Ayushi Vishwas Surange**  
*Data Mining & Machine Learning Engineering*
