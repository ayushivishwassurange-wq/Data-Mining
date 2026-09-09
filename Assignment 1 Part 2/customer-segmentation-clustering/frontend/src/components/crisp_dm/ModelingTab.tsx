import React from 'react';
import { Cpu, GitBranch, Binary, Network, CheckCircle2 } from 'lucide-react';

export const ModelingTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Phase 4: Modeling</h3>
            <p className="text-xs text-slate-400">Multi-Paradigm Clustering Algorithm Comparison</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          To establish the most robust customer partitions, 4 distinct unsupervised learning paradigms were developed and benchmarked:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400">
              <Binary className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">1. K-Means++ (Centroid-Based)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Minimizes Within-Cluster Sum of Squares (Inertia) $\sum \|x_i - \mu_j\|^2$. K-Means++ initialization spreads initial seeds to avoid local minima. Optimal at $k=5$.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400">
              <Network className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">2. DBSCAN (Density-Based)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Groups densely packed core points (points with sufficient neighbors within distance threshold) and isolates anomalous noise points (label = -1).
            </p>

          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <GitBranch className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">3. Agglomerative (Hierarchical)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Bottom-up hierarchical tree with Ward linkage minimizing total within-cluster variance. Preserves customer sub-cluster taxonomy.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">4. Gaussian Mixture Models (GMM)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Probabilistic model fitted with Expectation-Maximization (EM), yielding soft cluster assignment probabilities $P(C_k \mid x)$ and full covariance geometry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
