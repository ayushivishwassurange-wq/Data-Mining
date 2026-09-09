import React from 'react';
import { Database, PieChart, BarChart2, FileSpreadsheet } from 'lucide-react';

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
            <p className="text-xs text-slate-400">Multi-Attribute Customer Profiling & RFM Dynamics</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          The dataset integrates 500 multi-dimensional records combining core demographic indicators with transactional RFM (Recency, Frequency, Monetary) metrics:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <FileSpreadsheet className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">Demographic Dimensions</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• <strong>CustomerID</strong>: Unique identifier</li>
              <li>• <strong>Gender</strong>: Female (56%) / Male (44%)</li>
              <li>• <strong>Age</strong>: Range 18 to 72 (Mean: ~39 yrs)</li>
              <li>• <strong>Annual Income</strong>: $15k to $140k/year</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <BarChart2 className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">RFM Behavioral Metrics</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• <strong>Spending Score</strong>: 1 to 100 affinity index</li>
              <li>• <strong>Recency</strong>: Days since last order (1–150d)</li>
              <li>• <strong>Frequency</strong>: Order volume (1–60 orders/yr)</li>
              <li>• <strong>Monetary</strong>: Cumulative spend ($100–$12,000)</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400">
              <PieChart className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">Distribution Insights</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bimodal income and spending score distributions indicate 5 primary natural clusters plus extreme high-variance outliers suitable for density and anomaly testing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
