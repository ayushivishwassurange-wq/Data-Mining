import os
import json
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple

def generate_customer_dataset(n_samples: int = 500, random_state: int = 42) -> pd.DataFrame:
    """
    Generates a realistic, multi-attribute customer segmentation dataset
    combining Kaggle Mall Customer Demographics with E-Commerce RFM metrics.
    Features 5 core natural customer archetypes plus deliberate boundary noise/outliers.
    """
    np.random.seed(random_state)
    
    # Archetype 1: VIP Champions (High Income, High Spend, High Frequency, Low Recency) - 20%
    n1 = int(n_samples * 0.20)
    income1 = np.random.normal(95, 12, n1)
    spend1 = np.random.normal(85, 8, n1)
    age1 = np.random.normal(32, 6, n1)
    recency1 = np.random.exponential(12, n1) + 2
    freq1 = np.random.poisson(35, n1)
    monetary1 = income1 * spend1 * 0.95 + np.random.normal(500, 100, n1)

    # Archetype 2: Frugal Savers (High Income, Low Spend, Low Frequency) - 20%
    n2 = int(n_samples * 0.20)
    income2 = np.random.normal(88, 10, n2)
    spend2 = np.random.normal(20, 7, n2)
    age2 = np.random.normal(48, 8, n2)
    recency2 = np.random.exponential(45, n2) + 15
    freq2 = np.random.poisson(8, n2)
    monetary2 = income2 * spend2 * 0.8 + np.random.normal(200, 50, n2)

    # Archetype 3: Careless Trendsetters (Low Income, High Spend, High Frequency) - 20%
    n3 = int(n_samples * 0.20)
    income3 = np.random.normal(28, 8, n3)
    spend3 = np.random.normal(78, 10, n3)
    age3 = np.random.normal(24, 4, n3)
    recency3 = np.random.exponential(18, n3) + 5
    freq3 = np.random.poisson(24, n3)
    monetary3 = income3 * spend3 * 1.1 + np.random.normal(300, 60, n3)

    # Archetype 4: Budget Conscious (Low Income, Low Spend, Low Frequency, High Recency) - 20%
    n4 = int(n_samples * 0.20)
    income4 = np.random.normal(25, 7, n4)
    spend4 = np.random.normal(22, 8, n4)
    age4 = np.random.normal(52, 9, n4)
    recency4 = np.random.exponential(60, n4) + 25
    freq4 = np.random.poisson(4, n4)
    monetary4 = income4 * spend4 * 0.7 + np.random.normal(150, 40, n4)

    # Archetype 5: Balanced Middle-Class (Moderate Income, Moderate Spend) - 15%
    n5 = int(n_samples * 0.15)
    income5 = np.random.normal(55, 8, n5)
    spend5 = np.random.normal(50, 9, n5)
    age5 = np.random.normal(38, 7, n5)
    recency5 = np.random.exponential(30, n5) + 10
    freq5 = np.random.poisson(16, n5)
    monetary5 = income5 * spend5 * 0.85 + np.random.normal(350, 70, n5)

    # Outliers / Noise (Extreme values for DBSCAN testing) - 5%
    n6 = n_samples - (n1 + n2 + n3 + n4 + n5)
    income6 = np.random.uniform(15, 140, n6)
    spend6 = np.random.uniform(1, 99, n6)
    age6 = np.random.uniform(18, 72, n6)
    recency6 = np.random.uniform(1, 150, n6)
    freq6 = np.random.randint(1, 45, n6)
    monetary6 = np.random.uniform(200, 9000, n6)

    # Concatenate all cohorts
    incomes = np.concatenate([income1, income2, income3, income4, income5, income6])
    spends = np.concatenate([spend1, spend2, spend3, spend4, spend5, spend6])
    ages = np.concatenate([age1, age2, age3, age4, age5, age6])
    recencies = np.concatenate([recency1, recency2, recency3, recency4, recency5, recency6])
    freqs = np.concatenate([freq1, freq2, freq3, freq4, freq5, freq6])
    monetaries = np.concatenate([monetary1, monetary2, monetary3, monetary4, monetary5, monetary6])

    # Clip values to realistic domains
    incomes = np.clip(np.round(incomes, 1), 15.0, 140.0)
    spends = np.clip(np.round(spends, 1), 1.0, 99.0)
    ages = np.clip(np.round(ages).astype(int), 18, 72)
    recencies = np.clip(np.round(recencies).astype(int), 1, 150)
    freqs = np.clip(np.round(freqs).astype(int), 1, 60)
    monetaries = np.clip(np.round(monetaries, 2), 50.0, 12000.0)

    genders = np.random.choice(["Female", "Male"], size=n_samples, p=[0.56, 0.44])

    df = pd.DataFrame({
        "CustomerID": [1001 + i for i in range(n_samples)],
        "Gender": genders,
        "Age": ages,
        "AnnualIncome": incomes, # in $k
        "SpendingScore": spends, # 1-100
        "Recency": recencies, # days
        "Frequency": freqs, # orders / yr
        "Monetary": monetaries, # total $
    })

    return df

def calculate_eda_metrics(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Computes statistical summaries, feature correlations, and distribution histograms.
    """
    numeric_cols = ["Age", "AnnualIncome", "SpendingScore", "Recency", "Frequency", "Monetary"]
    
    # 1. Summary stats
    describe_df = df[numeric_cols].describe()
    summary_stats = {}
    for col in numeric_cols:
        summary_stats[col] = {
            "mean": round(float(describe_df[col]["mean"]), 2),
            "std": round(float(describe_df[col]["std"]), 2),
            "min": round(float(describe_df[col]["min"]), 2),
            "q25": round(float(describe_df[col]["25%"]), 2),
            "median": round(float(describe_df[col]["50%"]), 2),
            "q75": round(float(describe_df[col]["75%"]), 2),
            "max": round(float(describe_df[col]["max"]), 2),
        }

    # 2. Correlation matrix
    corr_matrix = df[numeric_cols].corr().round(3).to_dict()

    # 3. Histograms for key features
    histograms = {}
    for col in numeric_cols:
        counts, bin_edges = np.histogram(df[col], bins=12)
        histograms[col] = {
            "counts": counts.tolist(),
            "bin_edges": [round(float(b), 1) for b in bin_edges]
        }

    # 4. Gender distribution
    gender_counts = df["Gender"].value_counts().to_dict()

    return {
        "total_customers": len(df),
        "numeric_features": numeric_cols,
        "summary_stats": summary_stats,
        "correlation_matrix": corr_matrix,
        "histograms": histograms,
        "gender_distribution": gender_counts,
    }

if __name__ == "__main__":
    df = generate_customer_dataset(500)
    print(f"[+] Dataset created with {len(df)} customer records.")
    print(df.head())
    eda = calculate_eda_metrics(df)
    print(f"[+] Computed EDA metrics for {len(eda['numeric_features'])} features.")
