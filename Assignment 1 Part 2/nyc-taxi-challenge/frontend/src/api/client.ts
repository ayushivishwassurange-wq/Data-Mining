import {
  PredictionResult,
  ModelBenchmark,
  EDAInsights,
  FeatureImportance,
} from '../types';

const API_BASE = '/api';

export const api = {
  async checkHealth(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error('Health check failed');
      return res.json();
    } catch {
      return { status: 'offline', model_loaded: false };
    }
  },

  async predictTrip(params: {
    pickup_longitude: number;
    pickup_latitude: number;
    dropoff_longitude: number;
    dropoff_latitude: number;
    passenger_count: number;
    pickup_datetime?: string;
  }): Promise<PredictionResult> {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Prediction failed' }));
      throw new Error(err.detail || 'Prediction failed');
    }
    return res.json();
  },

  async predictBatch(trips: any[]): Promise<any> {
    const res = await fetch(`${API_BASE}/predict/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trips }),
    });
    if (!res.ok) throw new Error('Batch prediction failed');
    return res.json();
  },

  async uploadCsv(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/predict/upload-csv`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'CSV upload failed' }));
      throw new Error(err.detail || 'CSV upload failed');
    }
    return res.json();
  },

  async getBenchmarks(): Promise<{ success: boolean; models: ModelBenchmark[] }> {
    const res = await fetch(`${API_BASE}/models/benchmark`);
    if (!res.ok) throw new Error('Failed to fetch model benchmarks');
    return res.json();
  },

  async getEdaInsights(): Promise<{ success: boolean; data: EDAInsights }> {
    const res = await fetch(`${API_BASE}/eda/insights`);
    if (!res.ok) throw new Error('Failed to fetch EDA insights');
    return res.json();
  },

  async getFeatureImportance(): Promise<{ success: boolean; features: FeatureImportance[] }> {
    const res = await fetch(`${API_BASE}/features/importance`);
    if (!res.ok) throw new Error('Failed to fetch feature importance');
    return res.json();
  },

  getSampleCsvUrl(): string {
    return `${API_BASE}/sample-csv`;
  },
};
