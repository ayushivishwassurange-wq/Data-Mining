import React from 'react';
import { Database, ShoppingCart, Layers, PieChart } from 'lucide-react';

export const DataUnderstandingTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Phase 2: Data Understanding</h3>
            <p className="text-xs text-slate-400">Transaction Characteristics & Item Hierarchy</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          The transaction dataset comprises 1,000 retail baskets across 33 distinct stock keeping units (SKUs) structured across 6 core supermarket aisles:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <ShoppingCart className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">Transaction Dynamics</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
              <li>• Total Transactions: <strong>1,000</strong></li>
              <li>• Average Basket Size: <strong>4.2 items</strong></li>
              <li>• Median Basket Size: <strong>4.0 items</strong></li>
              <li>• Max Basket Size: <strong>10 items</strong></li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <Layers className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">Category Hierarchy</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• <strong>Bakery</strong>: Bread, Baguettes, Croissants</li>
              <li>• <strong>Dairy</strong>: Milk, Butter, Cheese, Eggs</li>
              <li>• <strong>Pantry</strong>: Pasta, Sauces, Olive Oil</li>
              <li>• <strong>Produce / Snacks / Beverages</strong></li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <PieChart className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">Sparsity Profile</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Binary transaction matrix has an overall sparsity of <strong>87.2%</strong>. The anti-monotonicity property allows fast pruning of sparse item combinations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
