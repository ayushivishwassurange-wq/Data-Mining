# Predicting Heart Disease with Machine Learning: A Complete Case Study

*A step-by-step walkthrough — from raw clinical data to deployment-ready models*

---

## Why This Matters

Heart disease kills approximately **17.9 million people every year**, making it the leading cause of death worldwide (WHO, 2023). Yet early detection can reduce mortality by 30–50%. The challenge? Traditional risk tools like the Framingham Score rely on a handful of variables and linear assumptions. Machine learning can do better — integrating richer feature sets, discovering non-linear interactions, and flagging at-risk patients that traditional methods miss.

In this project, I built a **complete end-to-end ML pipeline** to predict heart disease from clinical data. This article walks through every step: cleaning messy real-world data, engineering clinically meaningful features, training and comparing three models, and extracting actionable insights for healthcare.

---

## The Dataset

I used the **Merged Heart Disease Dataset** from the UCI Machine Learning Repository — a combination of five landmark cardiac studies:

- Cleveland Clinic Foundation
- Hungarian Institute of Cardiology
- University Hospital, Zurich
- VA Long Beach Medical Center
- Statlog Heart Dataset

| Property | Value |
|---|---|
| Raw records | 2,181 |
| After cleaning | 894 unique patients |
| Features | 13 clinical attributes |
| Target | Binary — 1 = Heart Disease, 0 = No Disease |

### What the Features Mean

| Feature | Description | Clinical Significance |
|---|---|---|
| `age` | Patient age in years | Risk increases sharply after 50 |
| `sex` | 1 = Male, 0 = Female | Males have higher prevalence pre-menopause |
| `cp` | Chest pain type (0–3) | Asymptomatic (0/3) paradoxically = highest risk |
| `trestbps` | Resting blood pressure (mm Hg) | Hypertension damages coronary arteries |
| `chol` | Serum cholesterol (mg/dL) | Surprisingly weak standalone predictor |
| `fbs` | Fasting blood sugar > 120 mg/dL | Diabetes marker |
| `restecg` | Resting ECG results (0–2) | ST-T abnormalities signal ischemia |
| `thalachh` | Maximum heart rate achieved (bpm) | Low max HR = poor cardiac reserve |
| `exang` | Exercise-induced angina (0/1) | Direct sign of exertional ischemia |
| `oldpeak` | ST depression during exercise | Core component of Duke Treadmill Score |
| `slope` | Slope of peak exercise ST segment | Downsloping = most severe ischemia |
| `ca` | Major vessels coloured by fluoroscopy (0–3) | Direct measure of coronary blockage |
| `thal` | Thallium perfusion scan result | Reversible defects = active ischemia |

> **Common misconception:** The `thal` column is frequently mislabelled as "thalassemia" online. It actually represents **Thallium-201 myocardial perfusion scintigraphy** — a nuclear imaging test for cardiac blood flow.

---

## Step 1: Data Cleaning

Real-world clinical data is messy. Here's what I found and fixed:

### Duplicates
The merged dataset contained **1,287 exact duplicate rows** — artifacts of combining overlapping databases. After deduplication: **894 unique patients**.

### Sentinel Values
Several columns used `0` or `?` as missing-data codes instead of proper null values:

| Issue | Rows Affected | Fix |
|---|---|---|
| `chol = 0` (impossible cholesterol) | ~170 | Replaced with NaN |
| `trestbps = 0` (impossible blood pressure) | ~1 | Replaced with NaN |
| `ca = ?` (string placeholder) | ~6 | Coerced to NaN |
| `thal = ?` (string placeholder) | ~2 | Coerced to NaN |
| `ca > 3` (out-of-range encoding) | Variable | Replaced with NaN |

### Imputation Strategy
Missing values were imputed with **column medians**, but critically — the imputer was **fitted only on training data** and then applied to the test set. This prevents data leakage, a subtle but common mistake in ML pipelines.

```python
# WRONG (leaks test info into training):
imputer.fit_transform(full_dataset)

# CORRECT (no leakage):
imputer.fit(X_train)
X_train = imputer.transform(X_train)
X_test  = imputer.transform(X_test)
```

---

## Step 2: Exploratory Data Analysis

### Target Distribution
The dataset is roughly balanced — approximately 55% heart disease vs 45% no disease — which is favourable for training without aggressive resampling.

### Key EDA Findings

**1. Age is a clear risk escalator.**
Heart disease prevalence rises sharply from ~35% in the 40–50 bracket to over 60% in the 60–70 bracket. Patients over 50 should receive heightened screening.

**2. The "asymptomatic" paradox.**
Counter-intuitively, patients with *no chest pain* (`cp = 0` or `3`, asymptomatic) show the **highest** heart disease rates. This reflects **referral bias** — asymptomatic patients were only sent for catheterisation when other severe risk indicators were already present. Clinically, this highlights the danger of "silent" heart disease.

**3. Exercise capacity is king.**
Patients with heart disease consistently show:
- Lower maximum heart rates (poor chronotropic response)
- More exercise-induced angina
- Greater ST depression during stress testing

**4. The cholesterol paradox.**
Total cholesterol showed surprisingly weak correlation with heart disease in this dataset. This may reflect statin usage, the limitations of a single-point measurement, or the known medical observation that total cholesterol alone is a poor predictor — fractionated lipid panels (LDL/HDL ratio) are far more informative.

**5. Gender disparity.**
Males exhibit significantly higher heart disease prevalence than females, consistent with the protective effect of oestrogen on the endothelium in pre-menopausal women.

---

## Step 3: Correlation Analysis

The Pearson correlation heatmap revealed the following ranked associations with heart disease:

| Feature | Correlation | Direction |
|---|---|---|
| `cp` (chest pain type) | Strong | Positive |
| `thalachh` (max heart rate) | Strong | Negative |
| `exang` (exercise angina) | Moderate | Positive |
| `oldpeak` (ST depression) | Moderate | Positive |
| `ca` (vessel count) | Moderate | Positive |
| `slope` (ST slope) | Moderate | Negative |
| `thal` (perfusion scan) | Moderate | Positive |
| `sex` | Moderate | Positive |
| `age` | Weak–Moderate | Positive |
| `chol` | Very weak | — |
| `fbs` | Very weak | — |

**Takeaway:** Exercise-related features (`thalachh`, `exang`, `oldpeak`, `slope`) collectively dominate predictive importance. A simple treadmill stress test provides enormous diagnostic value.

---

## Step 4: Feature Engineering

I engineered **7 new features** grounded in clinical domain knowledge:

| Feature | Logic | Clinical Rationale |
|---|---|---|
| `age_risk` | Age bucketed into 4 tiers | AHA age-based risk classification |
| `bp_cat` | BP staged: Normal → Stage 2 | ACC/AHA blood pressure guidelines |
| `chol_risk` | <200 / 200–240 / 240+ | NCEP cholesterol risk levels |
| `hr_ratio` | `thalachh / (220 − age)` | Chronotropic competence index — how close the patient gets to their predicted max HR |
| `risk_score` | Additive composite of 7 binary risk flags | Multi-factor risk stratification |
| `cp_exang` | `cp × exang` interaction | Captures symptom interaction |
| `oldpeak_log` | `log(1 + oldpeak)` | Reduces right skew for linear models |

These features encode clinical knowledge directly into the model's feature space, improving both predictive power and interpretability.

---

## Step 5: Model Training

### Setup
- **Train/Test Split:** 80/20 stratified (split *before* imputation — no data leakage)
- **Cross-Validation:** 5-fold stratified CV with ROC-AUC scoring
- **Hyperparameter Tuning:** `RandomizedSearchCV` (≤ 10 iterations per model)

### Model 1: Logistic Regression
Wrapped in a `sklearn.Pipeline` with `StandardScaler` so that scaling happens correctly inside each CV fold. Regularisation parameter `C` was tuned via grid search over `[0.01, 0.1, 0.5, 1, 5, 10]`.

**Why it matters:** LR provides a strong interpretable baseline. Its coefficients directly indicate which features push the prediction towards disease vs. health.

### Model 2: Random Forest
Tuned over `n_estimators`, `max_depth`, `min_samples_split`, and `min_samples_leaf`. Random forests handle non-linear interactions and are robust to feature scaling.

### Model 3: XGBoost
Tuned over `n_estimators`, `max_depth`, `learning_rate`, `subsample`, and `colsample_bytree`. Gradient boosting often achieves state-of-the-art results on structured/tabular data.

---

## Results

### Final Leaderboard

| Model | Accuracy | Precision | Recall | F1 Score | ROC-AUC |
|---|---|---|---|---|---|
| Logistic Regression | ~0.84 | ~0.84 | ~0.88 | ~0.86 | ~0.91 |
| Random Forest | ~0.87 | ~0.87 | ~0.90 | ~0.88 | ~0.93 |
| **XGBoost** | **~0.88** | **~0.87** | **~0.92** | **~0.89** | **~0.94** |

> *Note: Exact values depend on the random seed and data split. The relative ranking is consistent across runs.*

### What the ROC Curves Tell Us
All three models substantially outperform random guessing (AUC = 0.50). XGBoost shows the best discrimination — its curve hugs the top-left corner most tightly, meaning it achieves higher true positive rates at every false positive threshold.

### Feature Importance (Across Models)
The top 5 features consistently identified by both Random Forest and XGBoost:

1. **`thal`** — Thallium perfusion scan (anatomical evidence of ischemia)
2. **`ca`** — Number of diseased vessels (direct blockage count)
3. **`cp`** — Chest pain type (symptom profile)
4. **`oldpeak`** — ST depression (functional ischemia under stress)
5. **`thalachh`** — Max heart rate (exercise capacity)

These align perfectly with clinical cardiology literature — the Duke Treadmill Score, the gold standard for non-invasive cardiac risk assessment, is built on exercise time, ST depression, and angina — essentially the same features our ML models identified as most important.

---

## Business Insights & Clinical Recommendations

### 1. Silent Heart Disease Is the Biggest Threat
Asymptomatic patients have the highest disease rates. Screening protocols must target seemingly healthy high-risk individuals — not just those complaining of chest pain.

### 2. Exercise Testing Is the Most Valuable Single Procedure
The combination of max heart rate, exercise-induced angina, and ST depression captures most of the predictive signal. A simple treadmill stress test provides extraordinary diagnostic value relative to its cost.

### 3. Don't Screen with Cholesterol Alone
Total cholesterol is a weak standalone predictor. Clinicians should rely on comprehensive lipid panels and functional stress tests rather than a single cholesterol reading.

### 4. Optimise for Recall, Not Accuracy
In healthcare, a **False Negative** (missing a heart disease patient) is catastrophically more costly than a **False Positive** (ordering an unnecessary follow-up test). I recommend:
- Lowering the classification threshold from 0.50 to **0.30–0.35**
- This increases recall to ~0.95+ at the cost of some additional false alarms
- A missed diagnosis can lead to cardiac events; a false alarm leads only to a non-invasive test

### 5. Deploy as Triage, Not Diagnosis
This model should flag high-risk patients for cardiologist review — not replace clinical judgement. Integration into electronic health records (EHR) as an automated triage layer would be the ideal deployment.

### 6. Gender-Stratified Screening
Males show significantly higher prevalence. Screening intensity should be adjusted by gender and age, with aggressive protocols for males over 50.

---

## Limitations

1. **Temporal**: The underlying data is from the 1980s–1990s. Patient demographics, treatment protocols, and statin prevalence have shifted significantly.
2. **Geographic**: Predominantly European/American cohorts. The model may not generalise well to other populations.
3. **Feature scope**: Only 13 base features. Modern EHR systems capture hundreds of variables (labs, medications, imaging, genomics).
4. **Cross-sectional**: Single snapshot per patient — no longitudinal trajectory or progression data.
5. **Referral bias**: The dataset contains only patients referred for catheterisation, inflating baseline disease prevalence above the general population.

---

## Future Work

| Improvement | Expected Impact |
|---|---|
| **SHAP explainability** | Per-patient prediction explanations for clinician trust |
| **Deep learning (TabNet)** | Potential 1–3% AUC improvement with built-in attention |
| **Stacking ensemble** | XGBoost + RF + LR meta-learner for marginal gains |
| **Prospective validation** | Essential before any clinical deployment |
| **Expanded features** | Incorporate LDL/HDL ratio, medication history, imaging data |
| **Threshold calibration** | Platt scaling or isotonic regression for well-calibrated probabilities |

---

## Conclusion

Machine learning offers a powerful complement to traditional cardiovascular risk assessment. With careful data cleaning, clinically-grounded feature engineering, and rigorous model comparison, our best model (XGBoost) achieves strong discriminative performance (AUC ≈ 0.94).

But the most important finding isn't about the model — it's about the data. **Exercise stress testing features dominate every model's importance ranking.** The single most impactful thing a clinic can do is ensure high-risk patients receive a treadmill stress test. Our ML model then takes those results and amplifies the diagnostic signal far beyond what any manual risk score can achieve.

With proper threshold tuning for clinical safety (recall ≥ 0.90), SHAP-based explainability for transparency, and prospective validation, this approach has real potential to save lives through earlier detection of heart disease.

> *"The goal is not the most accurate model. The goal is the most lives saved."*

---

*Built with Python, Pandas, Scikit-learn, XGBoost, Matplotlib, and Seaborn.*
*Dataset: UCI Machine Learning Repository — Merged Heart Disease Dataset.*
*Full source code available on GitHub.*
