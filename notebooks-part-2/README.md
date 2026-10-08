# 🚀 Advanced Machine Learning, AutoML & GPU Data Science Curriculum (Part 2)

[![AutoGluon](https://img.shields.io/badge/AutoGluon-1.2%2B-orange.svg?logo=amazon-aws)](https://auto.gluon.ai)
[![NVIDIA RAPIDS](https://img.shields.io/badge/NVIDIA%20RAPIDS-24.x%2B-76B900.svg?logo=nvidia)](https://rapids.ai)
[![PyCaret](https://img.shields.io/badge/PyCaret-3.3%2B-blue.svg)](https://pycaret.org)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4%2B-F7931E.svg?logo=scikit-learn)](https://scikit-learn.org)
[![Google Colab](https://img.shields.io/badge/Runtime-Google%20Colab%20(CPU%2FGPU)-F9AB00.svg?logo=googlecolab)](https://colab.research.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Welcome to **Part 2** of the Machine Learning & Data Mining curriculum by **Ayushi Vishwas Surange**. While Part 1 established the foundational mathematics (Calculus, Linear Algebra, Probability, Statistics, NumPy, and Pandas), Part 2 transitions directly into **state-of-the-art enterprise machine learning architectures, automated machine learning (AutoML), GPU-accelerated computing, and production MLOps**.

All six notebooks in this series have been fully executed on Google Colab with pre-computed evaluation matrices, diagnostic curves, and interactive visualizations preserved.

---

## 🗺️ Curriculum Overview & Video Walkthroughs

| # | Masterclass Module | Core Architectural & Engineering Competencies | Notebook Link | Video Walkthrough |
| :-: | :--- | :--- | :---: | :---: |
| **01** | **AutoGluon: Capabilities Tour** | Multi-problem AutoML (11 problem types), 3-line paradigm, pinball loss quantile delivery windows, cost-sensitive fraud thresholds, zero-shot Amazon Chronos time series, multimodal transformer fusion (BERT-tiny + Tabular MLPs), vision defect classification (MobileNetV3), semantic search embeddings, and Tabular Foundation Models (TabPFN). | [Open Notebook](./final_autogluon_capabilities_tour.ipynb) | [▶️ Watch Video](https://www.youtube.com/watch?v=dmNLMn_HaNw) |
| **02** | **AutoGluon: Zero to Hero** | The AutoML lifecycle, naive baselines rule, multi-layer stacking mechanics without data leakage via out-of-fold (OOF) cross-validation, probability calibration (reliability curves), feature leakage diagnostics, model distillation into lightweight LightGBM student models (Pareto latency frontier), and Population Stability Index (PSI) drift monitoring. | [Open Notebook](./final_autogluon_zero_to_hero.ipynb) | [▶️ Watch Video](https://www.youtube.com/watch?v=zmL1LjBRIqE) |
| **03** | **K-Means Clustering: Zero to Hero** | Mathematical derivation of Lloyd's algorithm from scratch in raw NumPy (assignment & centroid updates), Voronoi cell geometry, failure of random initialization, $D(x)^2$ sampling proof of K-Means++, choosing $K$ (Elbow curve, Silhouette knife-blade plots, Gap statistic), 3 textbook failure cases, RFM customer segmentation, 16M-color quantization, surrogate decision trees, and multimodal LLM cluster naming. | [Open Notebook](./final_kmeans_zero_to_hero.ipynb) | [▶️ Watch Video](https://www.youtube.com/watch?v=ZWya94I1u0Y) |
| **04** | **NVIDIA RAPIDS: Zero to Hero** | GPU data science architecture (Tesla T4), memory bandwidth vs. CPU core scaling, Apache Arrow columnar GPU memory, zero-code acceleration via `%load_ext cudf.pandas`, cuML drop-in Scikit-Learn algorithms (50x Random Forest & UMAP acceleration), unified memory (UVM) spilling, Dask-cuDF multi-million row out-of-core scaling, GPU XGBoost with GPU TreeSHAP, and cuGraph network analytics. | [Open Notebook](./final_nvidia_rapids_zero_to_hero.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_RAPIDS_VIDEO_ID) |
| **05** | **PyCaret: Capabilities Tour** | Low-code end-to-end ML lifecycle, `setup()` automatic pipeline creation, 15-model cross-validation benchmarking (`compare_models()`), continuous regression with residual diagnostics, one-line ensembling (tuning, bagging, boosting, blending, stacking), leak-free SMOTE imbalanced learning, unsupervised clustering & Isolation Forest anomaly detection, and time-series forecasting with exogenous promotions. | [Open Notebook](./final_pycaret_capabilities_tour.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_PYCARET_TOUR_VIDEO_ID) |
| **06** | **PyCaret: Zero to Hero** | Low-code vs. hand-built Scikit-Learn pipelines, exhaustive `setup()` preprocessing engine (imputation, multicollinearity removal, encoding), Expected Calibration Error (ECE), financial cost-aware decision thresholding, subtle feature leakage traps and feature attribution diagnostics, local SHAP reason codes for FCRA compliance, fairness audits, and automated retraining pipelines. | [Open Notebook](./final_pycaret_zero_to_hero.ipynb) | [▶️ Watch Video](https://youtu.be/YOUR_PYCARET_ZTH_VIDEO_ID) |

---

## 🔬 Core Engineering & Architectural Deep-Dives

```
notebooks-part-2/
├── final_autogluon_capabilities_tour.ipynb  # 11 Problem types, Chronos, Multimodal & TabPFN
├── final_autogluon_zero_to_hero.ipynb       # Stacking, OOF cross-validation, Distillation & PSI
├── final_kmeans_zero_to_hero.ipynb          # Lloyd's from scratch, K-Means++, Gap Stat & MLOps
├── final_nvidia_rapids_zero_to_hero.ipynb   # cuDF, cudf.pandas, cuML, Dask-cuDF & cuGraph
├── final_pycaret_capabilities_tour.ipynb    # Low-code classification, regression, time-series
├── final_pycaret_zero_to_hero.ipynb         # Full lifecycle, preprocessing knobs, leakage, SHAP
└── README.md                                # Master curriculum documentation & video index
```

### 1. AWS AutoGluon: Multi-Layer Stacking & The Foundation Frontier
* **The Multi-Layer Stacking Architecture:** While standard AutoML frameworks expend hours performing grid searches across a single algorithm family (yielding marginal ~0.3% gains), AutoGluon trains a diverse zoo of model families (LightGBM, CatBoost, XGBoost, Deep Neural Networks) and feeds their **Out-of-Fold (OOF)** predictions as meta-features into Level-2 and Level-3 stackers.
* **Leak-Free Meta-Learning:** Training meta-models on in-sample predictions causes catastrophic overfitting. By enforcing strict $k$-fold cross-validation at Level 1, Level 2 learns true generalizable model combination weights.
* **Chronos & TabPFN:** Integrates pretrained time-series foundation transformers (Amazon Chronos) for zero-shot probabilistic forecasting and Tabular Foundation Models (TabPFN) that perform Bayesian inference on small tabular datasets in a single transformer forward pass.
* **Production Distillation:** Large stacked ensembles can be compressed into a single, high-speed student model (such as a single LightGBM) via soft-probability distillation, achieving sub-millisecond production inference latency while retaining ~98% of the ensemble's ROC-AUC.

### 2. K-Means Clustering: Algorithmic Rigor & Real-World Failure Modes
* **Expectation-Maximization Heuristic:** Lloyd's algorithm alternates between two steps to minimize Within-Cluster Sum of Squares (Inertia):
  1. *Assignment Step:* $C_k^{(t)} = \{x_i : \|x_i - \mu_k^{(t)}\|^2 \le \|x_i - \mu_j^{(t)}\|^2 \; \forall j\}$
  2. *Update Step:* $\mu_k^{(t+1)} = \frac{1}{|C_k^{(t)}|} \sum_{x_i \in C_k^{(t)}} x_i$
* **K-Means++ $D^2$ Seeding:** Overcomes local minimum trapping by choosing initial centroids with probability proportional to the squared Euclidean distance from the closest existing center: $P(x) = \frac{D(x)^2}{\sum D(x')^2}$, providing a provable $O(\log K)$ competitive guarantee against the optimal clustering.
* **Model Selection Beyond Heuristics:** Evaluates optimal $K$ rigorously using the Gap Statistic (comparing $\log(\text{Inertia})$ against a uniform null distribution), Silhouette knife-blade analysis, and cluster stability metrics.
* **The 3 Classic Failure Cases:** Proves empirically where spherical prototype clustering breaks down—unequal cluster sizes, varied cluster densities, and non-convex geometries (interlocking moons and concentric rings)—benchmarking against DBSCAN and Agglomerative Hierarchical clustering.

### 3. NVIDIA RAPIDS: Hardware Acceleration & High-Throughput Data Science
* **Memory Bandwidth as the Primary Bottleneck:** Explains why GPUs accelerate tabular data science by 50x: standard CPU DDR4/DDR5 memory channels provide 30–50 GB/s bandwidth, whereas modern GPU GDDR6/HBM memory delivers **320 to 1,000+ GB/s**. Tabular filtering, aggregation, and hash-joins stream across thousands of CUDA cores without memory starvation.
* **Apache Arrow Columnar Layout:** Memory buffers are formatted identically between cuDF and GPU memory, eliminating expensive serialization and deserialization overhead.
* **Zero-Code Acceleration (`cudf.pandas`):** Automatically offloads native Pandas commands to GPU kernels with transparent, graceful fallback to CPU Pandas for unsupported edge operations.
* **Scalable Memory Engineering:** Leverages RAPIDS Memory Manager (RMM) pools, Unified Virtual Memory (UVM) spilling over PCIe to prevent Out-of-Memory (OOM) errors, and Dask-cuDF for multi-gigabyte out-of-core streaming.

### 4. PyCaret: Low-Code Engineering, Explainability & Production MLOps
* **Leak-Free Preprocessing Pipelines:** Automatically generates an encapsulated Scikit-Learn `Pipeline` during `setup()`. Imputation, encoding, scaling, and SMOTE resampling are fitted strictly on training folds and transformed onto validation holdouts.
* **The Leakage Trap Diagnostic:** Demonstrates how subtle lookahead bias and target-contaminated features create artificially perfect models ($R^2 > 0.99$), and details permutation importance audits to detect and eliminate leakage before deployment.
* **Interpretable AI & Compliance:** Extracts individual prediction Reason Codes using TreeSHAP and Kernel SHAP, outputting legally compliant attribution factors for regulated industries (e.g., credit scoring and insurance under FCRA/GDPR).
* **MLOps Drift Detection:** Continuously calculates the Population Stability Index (PSI) between baseline and production feature distributions:
  $$\text{PSI} = \sum_{i=1}^B (A_i - E_i) \times \ln\left(\frac{A_i}{E_i}\right)$$
  triggering automated model retraining when $\text{PSI} > 0.25$.

---

## 🛠️ Execution & Environment Setup

All notebooks are designed to be executed directly in **Google Colab**:

| Notebook | Recommended Runtime | Key Dependencies |
| :--- | :---: | :--- |
| `final_autogluon_capabilities_tour.ipynb` | Colab CPU or T4 GPU | `autogluon`, `chronos-forecasting`, `tabpfn`, `timm` |
| `final_autogluon_zero_to_hero.ipynb` | Colab CPU or T4 GPU | `autogluon`, `shap`, `scikit-learn` |
| `final_kmeans_zero_to_hero.ipynb` | Colab CPU (Free) | `numpy`, `scikit-learn`, `matplotlib`, `seaborn` |
| `final_nvidia_rapids_zero_to_hero.ipynb` | Colab T4 GPU (Free) | `cudf`, `cuml`, `cugraph`, `dask-cudf`, `xgboost` |
| `final_pycaret_capabilities_tour.ipynb` | Colab CPU (Free) | `pycaret[full]`, `scikit-learn`, `shap` |
| `final_pycaret_zero_to_hero.ipynb` | Colab CPU (Free) | `pycaret[full]`, `optuna`, `shap`, `mlflow` |

---

## 👤 Author & Academic Context

* **Author:** Ayushi Vishwas Surange
* **Affiliation:** San José State University (SJSU) — Department of Computer Engineering
* **Program:** M.S. Artificial Intelligence / Data Mining
* **Repository:** [ayushivishwassurange-wq/Data-Mining](https://github.com/ayushivishwassurange-wq/Data-Mining)
