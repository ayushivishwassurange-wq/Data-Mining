import React from 'react';
import { Award, Gauge, TrendingDown, Layers } from 'lucide-react';

export const EvaluationTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Phase 5: Evaluation</h3>
            <p className="text-xs text-slate-400">Mathematical Metrics, Silhouette Analysis & Elbow Inflection</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Unlike supervised learning with ground truth labels, unsupervised clustering requires internal validation metrics balancing cluster separation (inter-cluster distance) and cluster tightness (intra-cluster variance):
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Gauge className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Silhouette Score</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">0.3924</div>
            <p className="text-[11px] text-slate-500 mt-1">Ranges [-1, +1] (Higher is superior)</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Davies-Bouldin Index</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">1.0837</div>
            <p className="text-[11px] text-slate-500 mt-1">Lower indicates better separation</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Calinski-Harabasz</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">360.47</div>
            <p className="text-[11px] text-slate-500 mt-1">Variance Ratio Criterion</p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Elbow Inflection & Silhouette Verification
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Plotting WCSS (Inertia) against cluster count $k \in [2, 10]$ reveals a pronounced "elbow inflection" at <strong className="text-emerald-400">k = 5</strong>, corroborating the business persona taxonomy of 5 natural customer segments.
          </p>
        </div>
      </div>
    </div>
  );
};
