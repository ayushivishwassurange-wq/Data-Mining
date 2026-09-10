from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class RuleEntry(BaseModel):
    antecedent: List[str]
    consequent: List[str]
    antecedent_str: str
    consequent_str: str
    rule_str: str
    support: float
    confidence: float
    lift: float
    leverage: float
    conviction: float
    zhang_metric: float

class MineRulesRequest(BaseModel):
    algorithm: str = Field(default="fp_growth", description="fp_growth, apriori, or eclat")
    min_support: float = Field(default=0.03, ge=0.01, le=0.5, description="Minimum itemset support threshold")
    min_confidence: float = Field(default=0.25, ge=0.05, le=1.0, description="Minimum rule confidence threshold")
    min_lift: float = Field(default=1.1, ge=0.5, le=10.0, description="Minimum lift threshold")
    max_rules: int = Field(default=100, ge=5, le=500, description="Maximum rules to return")

class MineRulesResponse(BaseModel):
    algorithm: str
    min_support: float
    min_confidence: float
    min_lift: float
    execution_time_ms: float
    total_frequent_itemsets: int
    total_rules_mined: int
    rules: List[RuleEntry]

class BasketRecommendRequest(BaseModel):
    items: List[str] = Field(..., description="List of items currently placed in the shopping basket")
    top_k: int = Field(default=5, ge=1, le=15)

class RecommendedItem(BaseModel):
    item: str
    max_confidence: float
    max_lift: float
    support: float
    triggered_by: List[str]
    rule_count: int

class BundleSuggestion(BaseModel):
    title: str
    description: str
    discount_pct: int
    added_item: str
    expected_aov_uplift: str

class BasketRecommendResponse(BaseModel):
    current_basket: List[str]
    basket_size: int
    recommendations: List[RecommendedItem]
    bundle_suggestions: List[BundleSuggestion]
    total_matched_rules: int

class GraphNode(BaseModel):
    id: str
    name: str
    type: str
    degree: int

class GraphLink(BaseModel):
    source: str
    target: str
    lift: float
    confidence: float
    support: float
    rule_label: str

class NetworkGraphResponse(BaseModel):
    total_nodes: int
    total_links: int
    nodes: List[GraphNode]
    links: List[GraphLink]

class SpeedBenchmarkResponse(BaseModel):
    benchmarks: List[Dict[str, Any]]
