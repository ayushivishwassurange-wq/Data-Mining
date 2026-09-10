import React from 'react';
import { Target, TrendingUp, ShoppingBag, DollarSign, Award } from 'lucide-react';

export const BusinessTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Phase 1: Business Understanding</h3>
            <p className="text-xs text-slate-400">Market Basket Optimization, Merchandising & AOV Uplift</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Retail merchandising and e-commerce checkouts suffer from low cross-sell attachment rates when product suggestions are unpersonalized. 
          The objective of this project is to apply frequent pattern mining to discover non-obvious product affinity bundles (e.g. <em>Pasta ➔ Tomato Sauce & Wine</em>), optimize store shelf adjacency layouts, and power real-time shopping cart recommendation widgets to expand <strong>Average Order Value (AOV)</strong> by up to <strong>+18.5%</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">AOV Uplift</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">+18.5%</div>
            <p className="text-[11px] text-slate-500 mt-1">Via targeted bundle discounts</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Cross-Sell Rate</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">+24.2%</div>
            <p className="text-[11px] text-slate-500 mt-1">At cashier checkout</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Peak Lift Metric</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">5.05x Affinity</div>
            <p className="text-[11px] text-slate-500 mt-1">High purchase dependency</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Inference Speed</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">&lt; 2 ms</div>
            <p className="text-[11px] text-slate-500 mt-1">Live cart recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
};
