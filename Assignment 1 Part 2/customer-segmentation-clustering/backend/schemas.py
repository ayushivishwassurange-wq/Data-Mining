from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class CustomerInput(BaseModel):
    gender: str = Field(default="Female", description="Gender: Female or Male")
    age: int = Field(default=35, ge=18, le=80, description="Age in years")
    annual_income: float = Field(default=65.0, ge=10.0, le=200.0, description="Annual Income in $k")
    spending_score: float = Field(default=50.0, ge=1.0, le=100.0, description="Spending score 1-100")
    recency: int = Field(default=30, ge=1, le=200, description="Days since last purchase")
    frequency: int = Field(default=15, ge=1, le=100, description="Number of annual purchases")
    monetary: float = Field(default=2500.0, ge=10.0, le=50000.0, description="Total monetary spend ($)")

class CustomerPredictionResponse(BaseModel):
    cluster_id: int
    persona_name: str
    persona_tag: str
    color: str
    description: str
    actionable_strategy: str
    campaign_roi_potential: str
    churn_risk: str
    pca_coordinates: Dict[str, float]
    cluster_probabilities: Optional[List[float]] = None

class ClusterRunRequest(BaseModel):
    algorithm: str = Field(default="kmeans", description="kmeans, dbscan, hierarchical, or gmm")
    n_clusters: int = Field(default=5, ge=2, le=10)
    eps: float = Field(default=0.65, ge=0.1, le=2.0)
    min_samples: int = Field(default=5, ge=2, le=20)
    linkage: str = Field(default="ward", description="ward, complete, average, single")
    covariance_type: str = Field(default="full", description="full, tied, diag, spherical")

class ClusterMetrics(BaseModel):
    silhouette_score: float
    davies_bouldin_index: float
    calinski_harabasz_index: float
    inertia: Optional[float] = None
    noise_points: Optional[int] = None
    noise_percentage: Optional[float] = None
    bic: Optional[float] = None
    aic: Optional[float] = None

class ClusterPersona(BaseModel):
    cluster_id: int
    name: str
    tag: str
    color: str
    customer_count: int
    percentage: float
    avg_income: float
    avg_spending: float
    avg_age: float
    avg_recency: float
    avg_frequency: float
    avg_monetary: float
    description: str
    actionable_strategy: str
    campaign_roi_potential: str
    churn_risk: str

class ClusterRunResponse(BaseModel):
    algorithm: str
    n_clusters: int
    metrics: ClusterMetrics
    personas: List[ClusterPersona]
    centroids_pca: Optional[List[List[float]]] = None
    labels: List[int]

class ElbowCurveResponse(BaseModel):
    k_values: List[int]
    inertias: List[float]
    silhouettes: List[float]
    davies_bouldin: List[float]
