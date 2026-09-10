import {
  MineRulesResult,
  BasketRecommendResult,
  NetworkGraphData,
  SpeedBenchmark,
  EdaData,
  FrequentItemset,
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
    if (!res.ok) throw new Error('Failed to load EDA stats');
    return res.json();
  },

  async getNetworkGraph(): Promise<NetworkGraphData> {
    const res = await fetch(`${API_BASE}/network/graph`);
    if (!res.ok) throw new Error('Failed to load network graph');
    return res.json();
  },

  async getBenchmarkSpeed(): Promise<{ benchmarks: SpeedBenchmark[] }> {
    const res = await fetch(`${API_BASE}/benchmark/speed`);
    if (!res.ok) throw new Error('Failed to load algorithm benchmarks');
    return res.json();
  },

  async getFrequentItemsets(): Promise<{ total_count: number; itemsets: FrequentItemset[] }> {
    const res = await fetch(`${API_BASE}/frequent/itemsets`);
    if (!res.ok) throw new Error('Failed to load frequent itemsets');
    return res.json();
  },

  async mineRules(params: {
    algorithm: string;
    min_support: number;
    min_confidence: number;
    min_lift: number;
    max_rules?: number;
  }): Promise<MineRulesResult> {
    const res = await fetch(`${API_BASE}/rules/mine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Mining rules failed');
    return res.json();
  },

  async recommendBasket(items: string[], top_k: number = 5): Promise<BasketRecommendResult> {
    const res = await fetch(`${API_BASE}/recommend/basket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, top_k }),
    });
    if (!res.ok) throw new Error('Basket recommendation failed');
    return res.json();
  },

  async getCrispDm() {
    const res = await fetch(`${API_BASE}/crisp-dm`);
    if (!res.ok) throw new Error('Failed to load CRISP-DM info');
    return res.json();
  }
};
