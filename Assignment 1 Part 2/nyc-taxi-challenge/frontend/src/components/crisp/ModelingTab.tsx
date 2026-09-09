import React from 'react';
import {
  Cpu,
  GitBranch,
  Layers,
  Zap,
  CheckCircle2,
  Sliders,
  Award,
  Sparkles,
} from 'lucide-react';

export const ModelingTab: React.FC = () => {
  const models = [
    {
      name: 'Linear Regression (Baseline)',
      category: 'Linear Baseline',
      status: 'Baseline',
      badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
      description: 'Standard Ordinary Least Squares (OLS) closed-form linear solver providing the foundational baseline performance.',
      hyperparameters: { 'Fit Intercept': 'True', 'Positive': 'False', 'Solver': 'SVD' },
      pros: 'Instantaneous training (<0.06s), highly interpretable linear weights.',
      cons: 'Cannot model non-linear airport threshold steps or complex spatial traffic boundaries.',
    },
    {
      name: 'Ridge Regression (L2 Regularization)',
      category: 'Regularized Linear',
      status: 'L2 Penalized',
      badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      description: 'Penalized linear regression applying L2 weight shrinkage to mitigate multi-collinearity between Manhattan and Haversine distances.',
      hyperparameters: { 'Alpha': '1.0', 'Max Iter': '1000', 'Solver': 'auto' },
      pros: 'Stable parameter estimates, guards against extreme coordinate overfitting.',
      cons: 'Limited capacity for piecewise flat rate boundaries ($70 JFK rule).',
    },
    {
      name: 'Random Forest Regressor',
      category: 'Bagging Ensemble',
      status: 'Ensemble',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      description: 'Ensemble of 80 deep decision trees trained via bootstrap aggregation (bagging) with random feature subspace sampling at each split.',
      hyperparameters: { 'N Estimators': '80', 'Max Depth': '12', 'N Jobs': '-1 (All Cores)' },
      pros: 'High non-linear capacity, captures complex borough interaction rules.',
      cons: 'Larger memory footprint (~12MB joblib) and slightly higher prediction latency.',
    },
    {
      name: 'XGBoost Regressor (Champion Model)',
      category: 'Gradient Boosting',
      status: 'Champion 🏆',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30 font-bold',
      description: 'Extreme Gradient Boosted decision tree framework optimizing second-order Taylor expansion loss with tree depth pruning and shrinkage regularization.',
      hyperparameters: { 'N Estimators': '200', 'Learning Rate': '0.08', 'Max Depth': '6', 'Subsample': '0.85' },
      pros: 'Superior test accuracy (RMSE: $1.659, R²: 0.9942), blazing fast inference (0.0015ms/prediction).',
      cons: 'Requires systematic hyperparameter tuning to avoid overfitting.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Phase Header */}
      <div className="bg-gradient-to-r from-purple-500/15 via-slate-900 to-slate-900 border border-purple-500/30 rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">CRISP-DM Phase 4</span>
            <h2 className="text-2xl font-extrabold text-white">Modeling Suite & Algorithm Comparison</h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
          We benchmark 4 diverse learning paradigms ranging from classic parametric Linear Models to non-parametric Bagging & Gradient Boosted Tree Ensembles to identify the optimal balance of prediction accuracy and production inference speed.
        </p>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {models.map((m) => (
          <div
            key={m.name}
            className={`bg-slate-900/60 p-5 rounded-3xl border transition-all duration-200 shadow-xl flex flex-col justify-between ${
              m.status.includes('Champion')
                ? 'border-amber-500/50 ring-1 ring-amber-500/20 bg-gradient-to-b from-slate-900 to-amber-950/10'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] border ${m.badgeClass}`}>
                  {m.status}
                </span>
                <span className="text-xs font-mono text-slate-500">{m.category}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{m.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{m.description}</p>
              </div>

              {/* Hyperparameters Table */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <Sliders className="w-3 h-3 text-amber-400" />
                  <span>Configured Hyperparameters</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {Object.entries(m.hyperparameters).map(([key, val]) => (
                    <div key={key} className="text-center p-1.5 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500">{key}</div>
                      <div className="text-xs font-mono font-bold text-slate-200 truncate">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
              <div className="flex items-start gap-1.5 text-emerald-400">
                <span className="font-bold">✓</span>
                <span className="text-slate-300">{m.pros}</span>
              </div>
              <div className="flex items-start gap-1.5 text-rose-400">
                <span className="font-bold">✗</span>
                <span className="text-slate-400">{m.cons}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
