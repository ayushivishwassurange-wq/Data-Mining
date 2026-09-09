export interface CustomerRecord {
  customer_id: number;
  gender: string;
  age: number;
  annual_income: number;
  spending_score: number;
  recency: number;
  frequency: number;
  monetary: number;
  pca_x: number;
  pca_y: number;
  pca_z: number;
  kmeans_cluster: number;
  dbscan_cluster: number;
  hierarchical_cluster: number;
  gmm_cluster: number;
}

export interface ClusterMetrics {
  silhouette_score: number;
  davies_bouldin_index: number;
  calinski_harabasz_index: number;
  inertia?: number;
  noise_points?: number;
  noise_percentage?: number;
  bic?: number;
  aic?: number;
}

export interface ClusterPersona {
  cluster_id: number;
  name: string;
  tag: string;
  color: string;
  customer_count: number;
  percentage: number;
  avg_income: number;
  avg_spending: number;
  avg_age: number;
  avg_recency: number;
  avg_frequency: number;
  avg_monetary: number;
  description: string;
  actionable_strategy: string;
  campaign_roi_potential: string;
  churn_risk: string;
}

export interface ClusterRunResult {
  algorithm: string;
  n_clusters: number;
  metrics: ClusterMetrics;
  personas: ClusterPersona[];
  centroids_pca?: number[][];
  labels: number[];
}

export interface ElbowCurveData {
  k_values: number[];
  inertias: number[];
  silhouettes: number[];
  davies_bouldin: number[];
}

export interface SummaryStat {
  mean: number;
  std: number;
  min: number;
  q25: number;
  median: number;
  q75: number;
  max: number;
}

export interface EdaData {
  total_customers: number;
  numeric_features: string[];
  summary_stats: Record<string, SummaryStat>;
  correlation_matrix: Record<string, Record<string, number>>;
  histograms: Record<string, { counts: number[]; bin_edges: number[] }>;
  gender_distribution: Record<string, number>;
}

export interface CustomerPrediction {
  cluster_id: number;
  persona_name: string;
  persona_tag: string;
  color: string;
  description: string;
  actionable_strategy: string;
  campaign_roi_potential: string;
  churn_risk: string;
  pca_coordinates: { x: number; y: number };
  cluster_probabilities?: number[];
}
