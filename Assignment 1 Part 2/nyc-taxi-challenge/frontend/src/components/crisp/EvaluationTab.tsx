import React, { useEffect, useState } from 'react';
import { ModelBenchmark, FeatureImportance } from '../../types';
import { api } from '../../api/client';
import {
  BarChart3,
  Award,
  Zap,
  TrendingUp,
  CheckCircle2,
  Sliders,
  Scale,
  Sparkles,
} from 'lucide-react';

export const EvaluationTab: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<ModelBenchmark[]>([]);
  const [features, setFeatures] = useState<FeatureImportance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getBenchmarks(), api.getFeatureImportance()])
      .then(([bmRes, fiRes]) => {
        if (bmRes.success) setBenchmarks(bmRes.models);
        if (fiRes.success) setFeatures(fiRes.features);
      })
      .catch((err) => console.error('Failed to load evaluation data:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 text-xs">
        Loading evaluation telemetry and model benchmarks...
      </div>
    );
  }

  const minRmse = Math.min(...benchmarks.map((b) => b.rmse));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Phase Header */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">CRISP-DM Phase 5</span>
            <h2 className="text-2xl font-extrabold text-white">Evaluation & Comparative Leaderboard</h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
          Comprehensive evaluation against the test holdout set (6,000 trips). XGBoost Regressor emerges as the clear champion with an RMSE of $1.659, R² of 0.9942, and sub-millisecond latency.
        </p>
      </div>

      {/* Benchmark Leaderboard Table */}
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl space-y-2">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Holdout Test Set Performance Leaderboard
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Test Sample: N=6,000 trips</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Model Architecture</th>
                <th className="py-3 px-4 text-right">RMSE ($) ↓</th>
                <th className="py-3 px-4 text-right">MAE ($) ↓</th>
                <th className="py-3 px-4 text-right">R² Score ↑</th>
                <th className="py-3 px-4 text-right">MAPE (%) ↓</th>
                <th className="py-3 px-4 text-right">Train Time</th>
                <th className="py-3 px-4 text-right">Latency / Pred</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {benchmarks.map((b) => {
                const isChampion = b.rmse === minRmse;
                return (
                  <tr
                    key={b.model_name}
                    className={`transition-colors ${
                      isChampion ? 'bg-amber-500/10 font-medium' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-200 flex items-center gap-2">
                      {isChampion && <Award className="w-4 h-4 text-amber-400 shrink-0" />}
                      <span>{b.model_name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-300">
                      ${b.rmse.toFixed(3)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                      ${b.mae.toFixed(3)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-400 font-bold">
                      {b.r2.toFixed(4)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                      {b.mape.toFixed(2)}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                      {b.train_time_sec}s
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-indigo-300">
                      {b.latency_ms_per_pred.toFixed(4)}ms
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isChampion
                            ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isChampion ? 'Champion' : 'Evaluated'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance Rankings */}
      <div className="bg-slate-900/50 p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              XGBoost Feature Importance Rankings (Gini Split Gain)
            </h3>
          </div>
          <span className="text-xs text-indigo-400 font-mono">Top Engineered Predictors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {features.slice(0, 10).map((f, idx) => {
            const pct = Math.round(f.importance * 100);
            return (
              <div key={f.feature} className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-slate-200">
                    <strong className="text-amber-400 mr-2">#{idx + 1}</strong>
                    {f.feature}
                  </span>
                  <span className="font-mono text-indigo-400 font-bold">{(f.importance * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 rounded-full"
                    style={{ width: `${Math.max(pct * 2, 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
