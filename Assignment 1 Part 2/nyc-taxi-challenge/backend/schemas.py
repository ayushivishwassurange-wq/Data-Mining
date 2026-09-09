from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class TripPredictionRequest(BaseModel):
    pickup_longitude: float = Field(..., description="Pickup Longitude (NYC: approx -74.05 to -73.75)", json_schema_extra={"example": -73.9855})
    pickup_latitude: float = Field(..., description="Pickup Latitude (NYC: approx 40.60 to 40.85)", json_schema_extra={"example": 40.7580})
    dropoff_longitude: float = Field(..., description="Dropoff Longitude", json_schema_extra={"example": -73.7781})
    dropoff_latitude: float = Field(..., description="Dropoff Latitude", json_schema_extra={"example": 40.6413})
    passenger_count: int = Field(default=1, ge=1, le=6, description="Passenger count between 1 and 6")
    pickup_datetime: Optional[str] = Field(default=None, description="ISO datetime or 'YYYY-MM-DD HH:MM:SS'", json_schema_extra={"example": "2025-06-15 17:30:00"})

class FareBreakdown(BaseModel):
    base_charge: float
    distance_charge: float
    rush_hour_surcharge: float
    overnight_surcharge: float
    congestion_fee: float
    airport_flat_or_toll: float
    total_fare: float

class TipSuggestions(BaseModel):
    tip_15_pct: float
    tip_20_pct: float
    tip_25_pct: float

class FeatureContribution(BaseModel):
    feature: str
    value: float
    importance_rank: int
    impact_description: str

class TripPredictionResponse(BaseModel):
    success: bool
    predicted_fare: float
    distance_miles: float
    manhattan_distance_miles: float
    bearing_degrees: float
    estimated_duration_minutes: float
    breakdown: FareBreakdown
    tips: TipSuggestions
    top_contributions: List[FeatureContribution]
    model_name: str
    inference_time_ms: float

class BatchItem(BaseModel):
    key: Optional[str] = None
    pickup_longitude: float
    pickup_latitude: float
    dropoff_longitude: float
    dropoff_latitude: float
    passenger_count: int = 1
    pickup_datetime: Optional[str] = None

class BatchPredictionRequest(BaseModel):
    trips: List[BatchItem]

class BatchPredictionResponse(BaseModel):
    success: bool
    total_trips: int
    total_predicted_revenue: float
    average_fare: float
    predictions: List[Dict[str, Any]]
    inference_time_total_ms: float
