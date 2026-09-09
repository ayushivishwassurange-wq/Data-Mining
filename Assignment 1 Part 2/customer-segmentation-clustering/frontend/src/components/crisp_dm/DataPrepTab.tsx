import React from 'react';
import { Filter, Layers, Sliders, ArrowRight } from 'lucide-react';

export const DataPrepTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <Filter className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Phase 3: Data Preparation</h3>
            <p className="text-xs text-slate-400">Feature Scaling, Normalization & PCA Projection</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Unsupervised clustering algorithms rely on Euclidean distances. Because monetary spend ($10,000) dominates smaller features like age (35), rigorous preprocessing is essential:
        </p>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4" /> 1. StandardScaler Normalization
            </h4>
            <p className="text-xs text-slate-400">
              Formula: <code className="text-emerald-300 font-mono">z = (x - μ) / σ</code>
            </p>
            <p className="text-[11px] text-slate-500">
              Transforms all 6 features to zero mean ($\mu=0$) and unit variance ($\sigma=1$), guaranteeing isotropic distance calculations across all dimensions.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" /> 2. Principal Component Analysis (PCA)
            </h4>
            <p className="text-xs text-slate-400">
              Eigenvalue Decomposition: <code className="text-cyan-300 font-mono">X_pca = X_scaled · V^T</code>
            </p>
            <p className="text-[11px] text-slate-500">
              Reduces 6 dimensions down to 2 principal components while retaining <strong className="text-cyan-300">79.7% of total variance</strong> (PCA 1: 57.6%, PCA 2: 22.1%).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
