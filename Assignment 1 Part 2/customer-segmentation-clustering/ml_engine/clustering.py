import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple, Optional
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.mixture import GaussianMixture
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score

FEATURE_COLS = ["AnnualIncome", "SpendingScore", "Age", "Recency", "Frequency", "Monetary"]

class CustomerClusteringPipeline:
    """
    End-to-End Multi-Algorithm Clustering & Dimensionality Reduction Engine.
    Supports K-Means, DBSCAN, Agglomerative Hierarchical, and Gaussian Mixture Models (GMM).
    """
    def __init__(self):
        self.scaler = StandardScaler()
        self.pca_2d = PCA(n_components=2, random_state=42)
        self.pca_3d = PCA(n_components=3, random_state=42)
        self.fitted = False

    def fit_preprocessors(self, df: pd.DataFrame):
        X = df[FEATURE_COLS].values
        self.scaler.fit(X)
        X_scaled = self.scaler.transform(X)
        self.pca_2d.fit(X_scaled)
        self.pca_3d.fit(X_scaled)
        self.fitted = True

    def get_pca_projections(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray, List[float]]:
        X = df[FEATURE_COLS].values
        X_scaled = self.scaler.transform(X)
        coords_2d = self.pca_2d.transform(X_scaled)
        coords_3d = self.pca_3d.transform(X_scaled)
        explained_variance_2d = [round(float(v), 4) for v in self.pca_2d.explained_variance_ratio_]
        return coords_2d, coords_3d, explained_variance_2d

    def run_kmeans(self, df: pd.DataFrame, n_clusters: int = 5) -> Dict[str, Any]:
        X_scaled = self.scaler.transform(df[FEATURE_COLS].values)
        model = KMeans(n_clusters=n_clusters, init="k-means++", n_init=10, random_state=42)
        labels = model.fit_predict(X_scaled)
        
        # Calculate centroids in original unscaled space
        centroids_unscaled = self.scaler.inverse_transform(model.cluster_centers_)
        centroids_pca = self.pca_2d.transform(model.cluster_centers_)

        metrics = self._calculate_metrics(X_scaled, labels)
        metrics["inertia"] = round(float(model.inertia_), 2)

        return {
            "algorithm": "K-Means",
            "n_clusters": n_clusters,
            "labels": labels.tolist(),
            "metrics": metrics,
            "centroids_unscaled": centroids_unscaled.tolist(),
            "centroids_pca": centroids_pca.tolist(),
            "model_obj": model
        }

    def run_dbscan(self, df: pd.DataFrame, eps: float = 0.65, min_samples: int = 5) -> Dict[str, Any]:
        X_scaled = self.scaler.transform(df[FEATURE_COLS].values)
        model = DBSCAN(eps=eps, min_samples=min_samples)
        labels = model.fit_predict(X_scaled)

        # Unique clusters ignoring noise label -1
        unique_labels = set(labels) - {-1}
        n_clusters = len(unique_labels)
        noise_count = int(np.sum(labels == -1))

        metrics = self._calculate_metrics(X_scaled, labels)
        metrics["noise_points"] = noise_count
        metrics["noise_percentage"] = round((noise_count / len(labels)) * 100, 2)

        return {
            "algorithm": "DBSCAN",
            "eps": eps,
            "min_samples": min_samples,
            "n_clusters": n_clusters,
            "labels": labels.tolist(),
            "metrics": metrics,
            "model_obj": model
        }

    def run_hierarchical(self, df: pd.DataFrame, n_clusters: int = 5, linkage: str = "ward") -> Dict[str, Any]:
        X_scaled = self.scaler.transform(df[FEATURE_COLS].values)
        model = AgglomerativeClustering(n_clusters=n_clusters, linkage=linkage)
        labels = model.fit_predict(X_scaled)

        metrics = self._calculate_metrics(X_scaled, labels)

        return {
            "algorithm": "Agglomerative Hierarchical",
            "n_clusters": n_clusters,
            "linkage": linkage,
            "labels": labels.tolist(),
            "metrics": metrics,
            "model_obj": model
        }

    def run_gmm(self, df: pd.DataFrame, n_components: int = 5, covariance_type: str = "full") -> Dict[str, Any]:
        X_scaled = self.scaler.transform(df[FEATURE_COLS].values)
        model = GaussianMixture(n_components=n_components, covariance_type=covariance_type, random_state=42)
        labels = model.fit_predict(X_scaled)
        probabilities = model.predict_proba(X_scaled)

        metrics = self._calculate_metrics(X_scaled, labels)
        metrics["bic"] = round(float(model.bic(X_scaled)), 2)
        metrics["aic"] = round(float(model.aic(X_scaled)), 2)

        # Mean cluster centers in original feature space
        centroids_unscaled = self.scaler.inverse_transform(model.means_)
        centroids_pca = self.pca_2d.transform(model.means_)

        return {
            "algorithm": "Gaussian Mixture Model (GMM)",
            "n_clusters": n_components,
            "covariance_type": covariance_type,
            "labels": labels.tolist(),
            "probabilities": probabilities.tolist(),
            "centroids_unscaled": centroids_unscaled.tolist(),
            "centroids_pca": centroids_pca.tolist(),
            "metrics": metrics,
            "model_obj": model
        }

    def _calculate_metrics(self, X_scaled: np.ndarray, labels: np.ndarray) -> Dict[str, Any]:
        unique_labels = set(labels)
        # Exclude noise points (-1) for metric computation if present
        valid_mask = labels != -1
        if len(unique_labels - {-1}) < 2 or np.sum(valid_mask) < 10:
            return {
                "silhouette_score": -1.0,
                "davies_bouldin_index": 99.0,
                "calinski_harabasz_index": 0.0,
            }

        X_valid = X_scaled[valid_mask]
        labels_valid = labels[valid_mask]

        sil = float(silhouette_score(X_valid, labels_valid))
        db = float(davies_bouldin_score(X_valid, labels_valid))
        ch = float(calinski_harabasz_score(X_valid, labels_valid))

        return {
            "silhouette_score": round(sil, 4),
            "davies_bouldin_index": round(db, 4),
            "calinski_harabasz_index": round(ch, 2),
        }

    def compute_elbow_curve(self, df: pd.DataFrame, max_k: int = 10) -> Dict[str, List[float]]:
        X_scaled = self.scaler.transform(df[FEATURE_COLS].values)
        k_values = list(range(2, max_k + 1))
        inertias = []
        silhouettes = []
        davies_bouldin = []

        for k in k_values:
            km = KMeans(n_clusters=k, init="k-means++", n_init=5, random_state=42)
            labels = km.fit_predict(X_scaled)
            inertias.append(round(float(km.inertia_), 2))
            silhouettes.append(round(float(silhouette_score(X_scaled, labels)), 4))
            davies_bouldin.append(round(float(davies_bouldin_score(X_scaled, labels)), 4))

        return {
            "k_values": k_values,
            "inertias": inertias,
            "silhouettes": silhouettes,
            "davies_bouldin": davies_bouldin
        }
