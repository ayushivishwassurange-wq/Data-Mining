import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Zap, 
  TrendingUp, 
  Layers, 
  Sparkles, 
  Database,
  Cpu,
  Clock,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api/client';
import { SpeedBenchmark, EdaData, MineRulesResult } from '../types';
import { BusinessTab } from './crisp_dm/BusinessTab';
import { DataUnderstandingTab } from './crisp_dm/DataUnderstandingTab';
import { DataPrepTab } from './crisp_dm/DataPrepTab';
import { ModelingTab } from './crisp_dm/ModelingTab';
import { EvaluationTab } from './crisp_dm/EvaluationTab';
import { DeploymentTab } from './crisp_dm/DeploymentTab';

export const AdminDashboard: React.FC = () => {
  const [activeCrispTab, setActiveCrispTab] = useState<'business' | 'understanding' | 'prep' | 'modeling' | 'evaluation' | 'deployment'>('business');
  const [benchmarks, setBenchmarks] = useState<SpeedBenchmark[]>([]);
  const [eda, setEda] = useState<EdaData | null>(null);
  const [miningSummary, setMiningSummary] = useState<MineRulesResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [benchRes, edaRes, rulesRes] = await Promise.all([
          api.getBenchmarkSpeed(),
          api.getEda(),
          api.mineRules({ algorithm: 'fp_growth', min_support: 0.03, min_confidence: 0.25, min_lift: 1.0, max_rules: 10 })
        ]);
        setBenchmarks(benchRes.benchmarks);
        setEda(edaRes);
        setMiningSummary(rulesRes);
      } catch (err) {
        console.error('Failed to load admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const crispTabs = [
    { id: 'business', label: '1. Business Understanding' },
    { id: 'understanding', label: '2. Data Understanding' },
    { id: 'prep', label: '3. Data Preparation' },
    { id: 'modeling', label: '4. Modeling Algorithms' },
    { id: 'evaluation', label: '5. Evaluation & Validation' },
    { id: 'deployment', label: '6. Deployment Operations' },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900/40 via-orange-950/30 to-slate-900 border border-amber-500/20 p-6 sm:p-8 backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Data Science Admin Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Market Basket & Associative Pattern Mining
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              End-to-end unsupervised data mining framework structured along the 6 phases of CRISP-DM. Powered by Apriori, FP-Growth, and ECLAT algorithms.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-amber-500/20 text-center min-w-[100px]">
              <span className="text-xs text-slate-400 block">Active Status</span>
              <span className="text-emerald-400 font-bold text-sm flex items-center justify-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Baskets</div>
          <div className="text-2xl font-black text-slate-100 mt-1">
            {eda ? eda.total_transactions.toLocaleString() : '1,000'}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">Kaggle Groceries</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Catalog SKUs</div>
          <div className="text-2xl font-black text-slate-100 mt-1">
            {eda ? eda.total_unique_items : '33'}
          </div>
          <div className="text-[11px] text-amber-400 font-medium mt-1">6 Top Aisles</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Basket Size</div>
          <div className="text-2xl font-black text-slate-100 mt-1">
            {eda ? eda.avg_basket_size.toFixed(2) : '4.82'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Items / checkout</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Frequent Sets</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {miningSummary ? miningSummary.total_frequent_itemsets : '778'}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">Supp &ge; 3.0%</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Strong Rules</div>
          <div className="text-2xl font-black text-orange-400 mt-1">
            {miningSummary ? miningSummary.total_rules_mined : '1,531'}
          </div>
          <div className="text-[11px] text-orange-400/80 mt-1">Conf &ge; 25%</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Peak Lift</div>
          <div className="text-2xl font-black text-rose-400 mt-1">5.05x</div>
          <div className="text-[11px] text-rose-400/80 font-medium mt-1">High Synergy</div>
        </div>
      </div>

      {/* Algorithm Benchmark Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Algorithm Performance Benchmark</h3>
              <p className="text-xs text-slate-400">Apriori vs. FP-Growth vs. ECLAT Execution Runtimes across Support Thresholds</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-amber-950/60 text-amber-400 px-3 py-1 rounded-full border border-amber-800 self-start sm:self-auto">
            1,000 Transactions Benchmark
          </span>
        </div>

        {/* Benchmark Table & Bar Visualizer */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Min Support</th>
                <th className="py-3 px-4">Apriori Runtime</th>
                <th className="py-3 px-4">FP-Growth Runtime</th>
                <th className="py-3 px-4">ECLAT Runtime</th>
                <th className="py-3 px-4">Speedup Factor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {benchmarks.length > 0 ? (
                benchmarks.map((bm, idx) => {
                  const maxMs = Math.max(bm.apriori_ms, bm.fp_growth_ms, bm.eclat_ms);
                  const speedup = (bm.apriori_ms / Math.max(bm.fp_growth_ms, 0.1)).toFixed(1);
                  return (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        {(bm.min_support * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400 w-16">{bm.apriori_ms.toFixed(2)} ms</span>
                          <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-500 h-full rounded-full" 
                              style={{ width: `${(bm.apriori_ms / maxMs) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 w-16">{bm.fp_growth_ms.toFixed(2)} ms</span>
                          <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full rounded-full" 
                              style={{ width: `${(bm.fp_growth_ms / maxMs) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400 w-16">{bm.eclat_ms.toFixed(2)} ms</span>
                          <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-purple-500 h-full rounded-full" 
                              style={{ width: `${(bm.eclat_ms / maxMs) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-amber-400 font-bold">
                        {speedup}x faster
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    Loading speed benchmark data...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRISP-DM 6-Phase Comprehensive Explorer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-slate-100">CRISP-DM 6-Phase Lifecycle Explorer</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Standard Data Mining Methodology</span>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {crispTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCrispTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeCrispTab === tab.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-900/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Panes */}
        <div className="transition-all duration-300">
          {activeCrispTab === 'business' && <BusinessTab />}
          {activeCrispTab === 'understanding' && <DataUnderstandingTab />}
          {activeCrispTab === 'prep' && <DataPrepTab />}
          {activeCrispTab === 'modeling' && <ModelingTab />}
          {activeCrispTab === 'evaluation' && <EvaluationTab />}
          {activeCrispTab === 'deployment' && <DeploymentTab />}
        </div>
      </div>
    </div>
  );
};
