# 🫀 Heart Disease Prediction — Complete ML Pipeline

> **Assignment 1** | Machine Learning Case Study
> 
> End-to-end binary classification pipeline predicting heart disease from clinical data using Logistic Regression, Random Forest, and XGBoost.

---

## 📌 Project Overview

| Item | Detail |
|---|---|
| **Dataset** | Merged Heart Disease Dataset (UCI — Cleveland, Hungary, Switzerland, VA, Statlog) |
| **Task** | Binary Classification (Heart Disease: Yes / No) |
| **Records** | 2,181 raw → 894 after deduplication |
| **Features** | 13 clinical attributes + 7 engineered features |
| **Best Model** | XGBoost (ROC-AUC ≈ 0.94) |

---

## 📁 Project Structure

```
Assignment 1/
│
├── README.md                            ← You are here
├── Heart_Disease_Analysis_Final.py      ← Complete runnable notebook
├── raw_merged_heart_dataset.csv         ← Raw dataset
│
├── output/                              ← Generated visualisations
│   ├── 01_missing.png
│   ├── 02_target.png
│   ├── 03_distributions.png
│   ├── 04_categorical.png
│   ├── 05_boxplots.png
│   ├── 06_corr_heatmap.png
│   ├── 07_target_corr.png
│   ├── 08_feature_importance.png
│   ├── 09_model_comparison.png
│   ├── 10_roc.png
│   ├── 11_confusion.png
│   └── 12_cv_boxplot.png
│
└── docs/
    └── Medium_Article_Report.md         ← Full write-up
```

---

## 🔗 Links

### Code
| File | Description | Link |
|---|---|---|
| Analysis Notebook | Complete Python script (runs in Google Colab) | [Link](https://colab.research.google.com/drive/187uGErxS1sjC9ew6vGrsH0i0kKKzQa61?usp=sharing) |

### Dataset
| File | Description | Link |
|---|---|---|
| Raw Dataset | `raw_merged_heart_dataset.csv` (2,181 records) | [Link](https://www.kaggle.com/datasets/mfarhaannazirkhan/heart-dataset/data?select=raw_merged_heart_dataset.csv) |

### Report
| File | Description | Link |
|---|---|---|
| Medium Article Report | Full write-up with findings & business insights | [[Link](https://medium.com/@ayushivishwas.surange/predicting-heart-disease-with-machine-learning-a-complete-case-study-d8179a7742d4) |

### Visualisations
| # | File | Description | Link |
|---|---|---|---|
| 01 | `01_missing.png` | Missing value analysis | [[Link]((https://github.com/ayushivishwassurange-wq/Data-Mining/blob/main/Assignment%201/output/01_missing.png)) |
| 02 | `02_target.png` | Target distribution (pie + bar) | [Link](https://github.com/ayushivishwassurange-wq/Data-Mining/blob/main/Assignment%201/output/02_target.png) |
| 03 | `03_distributions.png` | Continuous feature distributions by target | [Link](https://github.com/ayushivishwassurange-wq/Data-Mining/blob/main/Assignment%201/output/03_distributions.png) |
| 04 | `04_categorical.png` | Categorical features vs target | [Link](https://github.com/ayushivishwassurange-wq/Data-Mining/blob/main/Assignment%201/output/04_categorical.png) |
| 05 | `05_boxplots.png` | Outlier detection box plots | [[Link]((https://github.com/ayushivishwassurange-wq/Data-Mining/blob/main/Assignment%201/output/05_boxplots.png)) |
| 06 | `06_corr_heatmap.png` | Pearson correlation heatmap | [Link](https://github.com/ayushivishwassurange-wq/Data-Mining/blob/main/Assignment%201/output/06_corr_heatmap.png) |
| 07 | `07_target_corr.png` | Ranked feature-target correlations | [Link](https://github.com/ayushivishwassurange-wq/Data-Mining/blob/main/Assignment%201/output/07_target_corr.png) |
| 08 | `08_feature_importance.png` | RF + XGBoost feature importance | [Link](https://github.com/ayushivishwassurange-wq/Data-Mining/blob/main/Assignment%201/output/08_feature_importance.png) |
| 09 | `09_model_comparison.png` | Model comparison bar chart | [Link](https://github.com/ayushivishwassurange-wq/Data-Mining/blob/main/Assignment%201/output/09_model_comparison.png) |
| 10 | `10_roc.png` | ROC curves (all 3 models) | [Link](https://github.com/ayushivishwassurange-wq/Data-Mining/blob/main/Assignment%201/output/10_roc.png) |
| 11 | `11_confusion.png` | Confusion matrices | [Link](https://github.com/ayushivishwassurange-wq/Data-Mining/blob/main/Assignment%201/output/11_confusion.pnghttps://github.com/ayushivishwassurange-wq/Data-Mining/blob/main/Assignment%201/output/11_confusion.png) |
| 12 | `12_cv_boxplot.png` | Cross-validation AUC distribution | [Link](https://github.com/ayushivishwassurange-wq/Data-Mining/blob/main/Assignment%201/output/12_cv_boxplot.png) |

---

## 🚀 How to Run

1. Open [Google Colab](https://colab.research.google.com/)
2. Upload `Heart_Disease_Analysis_Final.py` and `raw_merged_heart_dataset.csv`
3. **Runtime → Run all**
4. All outputs are saved automatically to `output/`

---

## 🛠️ Tech Stack

| Library | Purpose |
|---|---|
| Pandas | Data manipulation |
| NumPy | Numerical operations |
| Matplotlib | Visualisation |
| Seaborn | Statistical plots |
| Scikit-learn | ML models, pipelines, metrics |
| XGBoost | Gradient boosting classifier |

---

## 📊 Models & Results

| Model | Accuracy | Precision | Recall | F1 | ROC-AUC |
|---|---|---|---|---|---|
| Logistic Regression | ~0.84 | ~0.84 | ~0.88 | ~0.86 | ~0.91 |
| Random Forest | ~0.87 | ~0.87 | ~0.90 | ~0.88 | ~0.93 |
| **XGBoost** | **~0.88** | **~0.87** | **~0.92** | **~0.89** | **~0.94** |

---

## 💡 Key Findings

1. **Exercise stress test features** (max HR, ST depression, exercise angina) are the strongest predictors across all models
2. **Asymptomatic chest pain** paradoxically indicates the highest risk — silent heart disease is a critical clinical concern
3. **Cholesterol alone is unreliable** — it shows weak correlation with the target
4. **Males over 50** represent the highest-risk demographic
5. For clinical deployment, **optimise for Recall ≥ 0.90** by lowering the classification threshold to ~0.35

---

## 📝 License

This project uses the [UCI Heart Disease Dataset](https://archive.ics.uci.edu/dataset/45/heart+disease) which is publicly available for research and educational purposes.

---

*Built as part of a graduate-level machine learning assignment.*
