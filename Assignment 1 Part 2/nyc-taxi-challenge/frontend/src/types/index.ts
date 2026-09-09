export type CRISPPhase = 
  | 'business' 
  | 'data_understanding' 
  | 'data_prep' 
  | 'modeling' 
  | 'evaluation' 
  | 'deployment';

export interface FareBreakdown {
  base_charge: number;
  distance_charge: number;
  rush_hour_surcharge: number;
  overnight_surcharge: number;
  congestion_fee: number;
  airport_flat_or_toll: number;
  total_fare: number;
}

export interface TipSuggestions {
  tip_15_pct: number;
  tip_20_pct: number;
  tip_25_pct: number;
}

export interface FeatureContribution {
  feature: string;
  value: number;
  importance_rank: number;
  impact_description: string;
}

export interface PredictionResult {
  success: boolean;
  predicted_fare: number;
  distance_miles: number;
  manhattan_distance_miles: number;
  bearing_degrees: number;
  estimated_duration_minutes: number;
  breakdown: FareBreakdown;
  tips: TipSuggestions;
  top_contributions: FeatureContribution[];
  model_name: string;
  inference_time_ms: number;
}

export interface ModelBenchmark {
  model_name: string;
  rmse: number;
  mae: number;
  r2: number;
  mape: number;
  train_time_sec: number;
  latency_ms_per_pred: number;
  predictions_sample: number[];
  actuals_sample: number[];
}

export interface EDAInsights {
  total_records: number;
  mean_fare: number;
  median_fare: number;
  std_fare: number;
  min_fare: number;
  max_fare: number;
  mean_distance_miles: number;
  passenger_distribution: Record<string, number>;
  hourly_avg_fare: Record<string, number>;
  hourly_trip_counts: Record<string, number>;
  fare_binned_distribution: { range: string; count: number }[];
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface LandmarkPreset {
  id: string;
  name: string;
  category: 'Airport' | 'Manhattan' | 'Brooklyn' | 'Transit';
  pickup: [number, number]; // [lat, lon]
  dropoff: [number, number]; // [lat, lon]
  description: string;
}
