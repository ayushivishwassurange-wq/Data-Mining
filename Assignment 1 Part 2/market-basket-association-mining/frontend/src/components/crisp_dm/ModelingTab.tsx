import React from 'react';
import { Cpu, Binary, Network, Zap, CheckCircle2 } from 'lucide-react';

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
            <p className="text-xs text-slate-400">Apriori vs FP-Growth vs ECLAT Algorithm Comparison</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Frequent itemset mining searches an exponential candidate space of size 2^N. Three algorithms with distinct algorithmic computational complexities were developed and benchmarked:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Binary className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">1. Apriori (Level-Wise)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uses candidate generation (C_k) and scans the database at every step. Prunes candidates using the anti-monotone support property.
              <br/><span className="text-amber-400 font-mono text-[11px]">Runtime @ 3% Support: ~242ms</span>
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <Zap className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">2. FP-Growth (Tree-Based)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compresses transactions into an FP-Tree and mines conditional pattern bases recursively without candidate generation (9x speedup).
              <br/><span className="text-emerald-400 font-mono text-[11px]">Runtime @ 3% Support: ~27ms</span>
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Network className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">3. ECLAT (Vertical Tidset)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Equivalence Class Clustering and bottom-up lattice traversal. Computes joint itemset support via set bitwise intersections.
              <br/><span className="text-cyan-400 font-mono text-[11px]">Runtime @ 3% Support: ~10ms</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
