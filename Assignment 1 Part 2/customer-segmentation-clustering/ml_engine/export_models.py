import os
import json
import pickle
import numpy as np
import pandas as pd
from data_loader import generate_customer_dataset, calculate_eda_metrics
from clustering import CustomerClusteringPipeline, FEATURE_COLS
from evaluator import generate_cluster_personas

def run_export_pipeline():
    print("=" * 65)
    print("CRISP-DM Phase 4 & 5: Modeling & Evaluation Pipeline")
    print("=" * 65)

    checkpoint_dir = os.path.join(os.path.dirname(__file__), "checkpoints")
    os.makedirs(checkpoint_dir, exist_ok=True)

    # 1. Generate & Save Dataset
    df = generate_customer_dataset(n_samples=500, random_state=42)
    data_csv_path = os.path.join(checkpoint_dir, "customers.csv")
    df.to_csv(data_csv_path, index=False)
    print(f"[+] Customer dataset generated: {len(df)} records -> Saved to {data_csv_path}")

    # 2. EDA Metrics
    eda = calculate_eda_metrics(df)
    eda_path = os.path.join(checkpoint_dir, "eda_metrics.json")
    with open(eda_path, "w", encoding="utf-8") as f:
        json.dump(eda, f, indent=2)
    print(f"[+] EDA statistics & correlations saved to {eda_path}")

    # 3. Fit Preprocessing & PCA
    pipeline = CustomerClusteringPipeline()
    pipeline.fit_preprocessors(df)

    coords_2d, coords_3d, exp_var = pipeline.get_pca_projections(df)
    print(f"[+] PCA fitted: 2D Explained Variance Ratio = {exp_var} (Total: {sum(exp_var)*100:.1f}%)")

    # 4. Train All 4 Clustering Models
    kmeans_res = pipeline.run_kmeans(df, n_clusters=5)
    dbscan_res = pipeline.run_dbscan(df, eps=0.65, min_samples=5)
    hier_res = pipeline.run_hierarchical(df, n_clusters=5, linkage="ward")
    gmm_res = pipeline.run_gmm(df, n_components=5, covariance_type="full")

    print(f"[+] K-Means (k=5): Silhouette = {kmeans_res['metrics']['silhouette_score']}, DB = {kmeans_res['metrics']['davies_bouldin_index']}, CH = {kmeans_res['metrics']['calinski_harabasz_index']}")
    print(f"[+] DBSCAN (eps=0.65): Clusters = {dbscan_res['n_clusters']}, Outliers = {dbscan_res['metrics']['noise_points']} ({dbscan_res['metrics']['noise_percentage']}%)")
    print(f"[+] Hierarchical (k=5): Silhouette = {hier_res['metrics']['silhouette_score']}")
    print(f"[+] GMM (k=5): Silhouette = {gmm_res['metrics']['silhouette_score']}, BIC = {gmm_res['metrics']['bic']}")

    # 5. Elbow Curve
    elbow_data = pipeline.compute_elbow_curve(df, max_k=10)
    print(f"[+] Elbow Curve computed for k=2..10 (Inertias: {elbow_data['inertias'][:3]}...)")

    # 6. Personas for K-Means (Primary Benchmark)
    personas = generate_cluster_personas(df, kmeans_res["labels"])

    # 7. Package Complete Customer Scatter Points
    customer_points = []
    for idx, row in df.iterrows():
        customer_points.append({
            "customer_id": int(row["CustomerID"]),
            "gender": str(row["Gender"]),
            "age": int(row["Age"]),
            "annual_income": float(row["AnnualIncome"]),
            "spending_score": float(row["SpendingScore"]),
            "recency": int(row["Recency"]),
            "frequency": int(row["Frequency"]),
            "monetary": float(row["Monetary"]),
            "pca_x": round(float(coords_2d[idx, 0]), 3),
            "pca_y": round(float(coords_2d[idx, 1]), 3),
            "pca_z": round(float(coords_3d[idx, 2]), 3),
            "kmeans_cluster": int(kmeans_res["labels"][idx]),
            "dbscan_cluster": int(dbscan_res["labels"][idx]),
            "hierarchical_cluster": int(hier_res["labels"][idx]),
            "gmm_cluster": int(gmm_res["labels"][idx]),
        })

    # 8. Save Clustering Report JSON
    report = {
        "dataset_summary": {
            "total_customers": len(df),
            "features": FEATURE_COLS,
            "pca_explained_variance_2d": exp_var,
            "pca_total_variance_2d": round(sum(exp_var), 4)
        },
        "models": {
            "kmeans": {
                "n_clusters": kmeans_res["n_clusters"],
                "metrics": kmeans_res["metrics"],
                "centroids_unscaled": kmeans_res["centroids_unscaled"],
                "centroids_pca": kmeans_res["centroids_pca"],
            },
            "dbscan": {
                "eps": dbscan_res["eps"],
                "min_samples": dbscan_res["min_samples"],
                "n_clusters": dbscan_res["n_clusters"],
                "metrics": dbscan_res["metrics"],
            },
            "hierarchical": {
                "n_clusters": hier_res["n_clusters"],
                "linkage": hier_res["linkage"],
                "metrics": hier_res["metrics"],
            },
            "gmm": {
                "n_components": gmm_res["n_clusters"],
                "covariance_type": gmm_res["covariance_type"],
                "metrics": gmm_res["metrics"],
                "centroids_unscaled": gmm_res["centroids_unscaled"],
                "centroids_pca": gmm_res["centroids_pca"],
            }
        },
        "elbow_curves": elbow_data,
        "personas": personas,
        "customers": customer_points,
    }

    report_path = os.path.join(checkpoint_dir, "clustering_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    print(f"[+] Full clustering report & scatter coordinates saved to {report_path}")

    # 9. Pickle Pipeline Objects
    pkl_path = os.path.join(checkpoint_dir, "pipeline.pkl")
    with open(pkl_path, "wb") as f:
        pickle.dump({
            "scaler": pipeline.scaler,
            "pca_2d": pipeline.pca_2d,
            "pca_3d": pipeline.pca_3d,
            "kmeans_model": kmeans_res["model_obj"],
            "gmm_model": gmm_res["model_obj"],
        }, f)
    print(f"[+] Fitted pipeline transformers & models pickled to {pkl_path}")
    print("\n[OK] Pipeline completed successfully!")

if __name__ == "__main__":
    run_export_pipeline()
