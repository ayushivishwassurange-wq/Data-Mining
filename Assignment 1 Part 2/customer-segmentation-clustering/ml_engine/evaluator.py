import numpy as np
import pandas as pd
from typing import Dict, Any, List

def generate_cluster_personas(df: pd.DataFrame, labels: List[int]) -> List[Dict[str, Any]]:
    """
    Analyzes centroid features for each cluster label and constructs rich
    behavioral customer personas with recommended marketing playbooks.
    """
    df_temp = df.copy()
    df_temp["Cluster"] = labels
    
    unique_clusters = sorted(list(set(labels)))
    personas = []

    # Persona template heuristics
    for c in unique_clusters:
        if c == -1:
            # DBSCAN Outliers
            subset = df_temp[df_temp["Cluster"] == -1]
            personas.append({
                "cluster_id": -1,
                "name": "Outliers & Noise Anomalies",
                "tag": "Outlier Segment",
                "color": "#f43f5e", # Rose
                "customer_count": len(subset),
                "percentage": round(len(subset) / len(df) * 100, 1),
                "avg_income": round(float(subset["AnnualIncome"].mean()), 1),
                "avg_spending": round(float(subset["SpendingScore"].mean()), 1),
                "avg_age": round(float(subset["Age"].mean()), 1),
                "avg_recency": round(float(subset["Recency"].mean()), 1),
                "avg_frequency": round(float(subset["Frequency"].mean()), 1),
                "avg_monetary": round(float(subset["Monetary"].mean()), 2),
                "description": "High-variance customers with erratic purchasing frequency or extreme income/spend ratios.",
                "actionable_strategy": "Flag for fraud inspection, send customized high-ticket surveys, or exclude from standard mass-marketing campaigns.",
                "campaign_roi_potential": "Medium (Niche)",
                "churn_risk": "High"
            })
            continue

        subset = df_temp[df_temp["Cluster"] == c]
        if len(subset) == 0:
            continue

        avg_income = float(subset["AnnualIncome"].mean())
        avg_spend = float(subset["SpendingScore"].mean())
        avg_age = float(subset["Age"].mean())
        avg_rec = float(subset["Recency"].mean())
        avg_freq = float(subset["Frequency"].mean())
        avg_mon = float(subset["Monetary"].mean())

        # Determine Persona Archetype based on Income & Spending quadrant
        if avg_income >= 70 and avg_spend >= 60:
            name = "VIP Champions"
            tag = "High-Value Core"
            color = "#a855f7" # Purple
            desc = "Affluent, highly active buyers with superior brand affinity and top-tier lifetime customer value (LTV)."
            strategy = "Invite to exclusive VIP lounge, early access product drops, white-glove support, and premium tier rewards."
            roi = "Highest (10x)"
            churn = "Low"
        elif avg_income >= 70 and avg_spend < 40:
            name = "Frugal Savers"
            tag = "High Income / Low Spend"
            color = "#38bdf8" # Cyan
            desc = "High earning potential but cautious spending habits. Rarely impulse buy and seek superior utility."
            strategy = "Target with premium product comparisons, quality durability guarantees, luxury bundles, and high-value incentives."
            roi = "High (5x)"
            churn = "Medium"
        elif avg_income < 45 and avg_spend >= 60:
            name = "Careless Trendsetters"
            tag = "Low Income / High Spend"
            color = "#fbbf24" # Amber
            desc = "Younger demographic enthusiastic about fashion and trending products despite modest income."
            strategy = "Engage with viral social media campaigns, flash discount sales, limited-time trend alerts, and BNPL financing."
            roi = "High (4x)"
            churn = "Medium-High"
        elif avg_income < 45 and avg_spend < 40:
            name = "Budget Conscious"
            tag = "Low Income / Low Spend"
            color = "#64748b" # Slate
            desc = "Price-sensitive shoppers with minimal discretionary budget and low purchase frequency."
            strategy = "Offer clearance promotions, discount coupons, essential product bundles, and free shipping thresholds."
            roi = "Moderate (2x)"
            churn = "High"
        else:
            name = "Balanced Mainstream"
            tag = "Moderate Spend / Moderate Income"
            color = "#10b981" # Emerald
            desc = "Core demographic with steady income and pragmatic, predictable shopping cycles."
            strategy = "Nurture with loyalty points programs, category cross-selling, seasonal newsletters, and milestone anniversary gifts."
            roi = "Steady (3x)"
            churn = "Low-Medium"

        personas.append({
            "cluster_id": c,
            "name": name,
            "tag": tag,
            "color": color,
            "customer_count": len(subset),
            "percentage": round(len(subset) / len(df) * 100, 1),
            "avg_income": round(avg_income, 1),
            "avg_spending": round(avg_spend, 1),
            "avg_age": round(avg_age, 1),
            "avg_recency": round(avg_rec, 1),
            "avg_frequency": round(avg_freq, 1),
            "avg_monetary": round(avg_mon, 2),
            "description": desc,
            "actionable_strategy": strategy,
            "campaign_roi_potential": roi,
            "churn_risk": churn
        })

    return personas
