import React from 'react';
import { Award, TrendingDown, Gauge, Sparkles } from 'lucide-react';

export const EvaluationTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Phase 5: Evaluation</h3>
            <p className="text-xs text-slate-400">Loss Convergence, Perplexity & Sampling Metrics</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Evaluation benchmarks both statistical metrics (Cross-Entropy Loss, Perplexity) and generative sampling behavior across diverse sampling strategies:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Train Loss</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">0.0239</div>
            <p className="text-[11px] text-slate-500 mt-1">Converged down from initial 4.08</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Gauge className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Validation PPL</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">1.02</div>
            <p className="text-[11px] text-slate-500 mt-1">PPL = exp(Val Loss) (exceptional confidence)</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Generation Speed</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">&gt; 12,000 tok/s</div>
            <p className="text-[11px] text-slate-500 mt-1">Training throughput on laptop CPU</p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Sampling Strategies Comparison
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
              <strong className="text-purple-300 block mb-1">Greedy (T = 0)</strong>
              Picks highest probability argmax token. Maximum determinism, ideal for exact code definitions.
            </div>
            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
              <strong className="text-cyan-300 block mb-1">Top-K Sampling (K = 40)</strong>
              Truncates distribution to top K tokens, preventing nonsensical long-tail tokens.
            </div>
            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
              <strong className="text-emerald-300 block mb-1">Top-P Nucleus (P = 0.90)</strong>
              Dynamically sets cutoff based on cumulative probability mass, adapting to certainty.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
