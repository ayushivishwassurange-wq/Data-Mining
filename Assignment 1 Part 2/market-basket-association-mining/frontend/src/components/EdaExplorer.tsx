import React, { useState, useEffect } from 'react';
import { BarChart3, Database, PieChart, ShoppingBag, Layers, Activity } from 'lucide-react';
import { api } from '../api/client';
import { EdaData } from '../types';

export const EdaExplorer: React.FC = () => {
  const [eda, setEda] = useState<EdaData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEda = async () => {
      try {
        setLoading(true);
        const data = await api.getEda();
        setEda(data);
      } catch (err) {
        console.error('Failed to load EDA:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEda();
  }, []);

  if (!eda) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500 font-mono text-sm">
        Loading EDA datasets and computing co-occurrences...
      </div>
    );
  }

  const maxItemCount = Math.max(...eda.top_frequent_items.map(i => i.count), 1);
  const maxBasketCount = Math.max(...eda.basket_size_distribution.map(i => i.count), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                Market Basket Exploratory Data Analysis (EDA)
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Distribution profiling of 1,000 retail transactions across 33 distinct supermarket products and 6 retail aisle categories.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Total Baskets</span>
              <strong className="text-amber-400 text-sm">1,000</strong>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block">Avg Basket Size</span>
              <strong className="text-emerald-400 text-sm">{eda.avg_basket_size} items</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Frequent Items */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            Top 15 Most Frequent Items (Itemset Support)
          </h3>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-2">
            {eda.top_frequent_items.map((it) => {
              const widthPct = (it.count / maxItemCount) * 100;
              return (
                <div key={it.item} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="font-medium">{it.item}</span>
                    <span className="font-mono text-amber-400 font-bold">{it.count} txs ({(it.support * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className="h-full bg-gradient-to-r from-amber-600 to-orange-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Basket Size Distribution */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Basket Size Distribution (Items per Transaction)
          </h3>

          <div className="h-56 bg-slate-950 rounded-xl border border-slate-800 p-4 flex items-end gap-3">
            {eda.basket_size_distribution.map((b) => {
              const heightPct = (b.count / maxBasketCount) * 100;
              return (
                <div key={b.basket_size} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {b.count}
                  </span>
                  <div
                    style={{ height: `${Math.max(heightPct, 4)}%` }}
                    className="w-full rounded-t bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-400 transition-all cursor-pointer shadow"
                    title={`Basket size: ${b.basket_size} items -> ${b.count} transactions`}
                  />
                  <span className="text-[10px] font-mono text-slate-400">
                    {b.basket_size}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>2 Items</span>
            <span>Median: {eda.median_basket_size} Items</span>
            <span>Max: {eda.max_basket_size} Items</span>
          </div>
        </div>
      </div>

      {/* Top Pairwise Co-occurrences Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Top Pairwise Item Co-Occurrence Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Item A</th>
                <th className="py-2.5 px-4">Item B</th>
                <th className="py-2.5 px-4">Co-Occurrence Count</th>
                <th className="py-2.5 px-4">Joint Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {eda.top_pairwise_affinities.map((pair, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4 text-amber-300 font-sans font-semibold">{pair.item_a}</td>
                  <td className="py-2.5 px-4 text-teal-300 font-sans font-semibold">{pair.item_b}</td>
                  <td className="py-2.5 px-4 text-slate-200 font-bold">{pair.co_occurrence_count} baskets</td>
                  <td className="py-2.5 px-4 text-emerald-400">{(pair.joint_support * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
