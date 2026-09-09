import {
  CustomerRecord,
  ClusterRunResult,
  ElbowCurveData,
  EdaData,
  ClusterPersona,
  CustomerPrediction,
} from '../types';

const API_BASE = '/api';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async getEda(): Promise<EdaData> {
    const res = await fetch(`${API_BASE}/eda`);
    if (!res.ok) throw new Error('Failed to load EDA data');
    return res.json();
  },

  async getCustomers(): Promise<{ total_customers: number; pca_variance: number[]; customers: CustomerRecord[] }> {
    const res = await fetch(`${API_BASE}/customers`);
    if (!res.ok) throw new Error('Failed to load customer scatter data');
    return res.json();
  },

  async getElbowCurves(): Promise<ElbowCurveData> {
    const res = await fetch(`${API_BASE}/elbow/curves`);
    if (!res.ok) throw new Error('Failed to load elbow curves');
    return res.json();
  },

  async getPersonas(): Promise<{ personas: ClusterPersona[] }> {
    const res = await fetch(`${API_BASE}/personas`);
    if (!res.ok) throw new Error('Failed to load personas');
    return res.json();
  },

  async runClustering(params: {
    algorithm: string;
    n_clusters?: number;
    eps?: number;
    min_samples?: number;
    linkage?: string;
    covariance_type?: string;
  }): Promise<ClusterRunResult> {
    const res = await fetch(`${API_BASE}/clustering/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to run clustering algorithm');
    return res.json();
  },

  async predictCustomer(data: {
    gender: string;
    age: number;
    annual_income: number;
    spending_score: number;
    recency: number;
    frequency: number;
    monetary: number;
  }): Promise<CustomerPrediction> {
    const res = await fetch(`${API_BASE}/cluster/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Customer prediction failed');
    return res.json();
  },

  async getCrispDm() {
    const res = await fetch(`${API_BASE}/crisp-dm`);
    if (!res.ok) throw new Error('Failed to load CRISP-DM info');
    return res.json();
  }
};
