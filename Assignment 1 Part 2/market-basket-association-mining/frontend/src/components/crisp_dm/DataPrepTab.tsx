import React from 'react';
import { Filter, Binary, Layers, GitCommit } from 'lucide-react';

export const DataPrepTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
            <Filter className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Phase 3: Data Preparation</h3>
            <p className="text-xs text-slate-400">One-Hot Encoding, FP-Tree Paths & Vertical Tidsets</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Raw transaction logs are transformed into optimized data structures to enable high-throughput candidate generation and tree traversals:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Binary className="w-4 h-4" /> 1. Horizontal One-Hot Matrix
            </h4>
            <p className="text-xs text-slate-400">
              Each row represents a transaction vector where entry (i, j) = 1 if item j was purchased in basket i, 0 otherwise.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" /> 2. FP-Tree Prefix Paths
            </h4>
            <p className="text-xs text-slate-400">
              Transactions are sorted by item frequency descending and inserted into a compact prefix tree with a linked header table, eliminating costly candidate scans.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <GitCommit className="w-4 h-4" /> 3. Vertical Tidset Maps
            </h4>
            <p className="text-xs text-slate-400">
              Maps each product item to the set of transaction IDs containing it, enabling rapid itemset support calculation via set intersections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
