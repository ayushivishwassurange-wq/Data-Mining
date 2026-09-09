import React, { useState, useEffect } from 'react';
import { BarChart3, Database, PieChart, Activity, Sparkles, Layers } from 'lucide-react';
import { api } from '../api/client';
import { EdaData } from '../types';

export const EdaExplorer: React.FC = () => {
  const [eda, setEda] = useState<EdaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string>('AnnualIncome');

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
        Loading EDA datasets and computing correlations...
      </div>
    );
  }

  const activeHist = eda.histograms[selectedFeature];
  const maxCount = activeHist ? Math.max(...activeHist.counts, 1) : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                Exploratory Data Analysis (EDA) & Feature Distributions
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Statistical summaries, multivariate correlation matrices, and density histograms across demographic and RFM features for 500 customer records.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Total Records</span>
              <strong className="text-emerald-400 text-sm">500</strong>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block">Female / Male</span>
              <strong className="text-cyan-400 text-sm">{eda.gender_distribution.Female || 280} / {eda.gender_distribution.Male || 220}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          Descriptive Summary Statistics
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Mean</th>
                <th className="py-3 px-4">Std Dev</th>
                <th className="py-3 px-4">Min</th>
                <th className="py-3 px-4">25% (Q1)</th>
                <th className="py-3 px-4">Median</th>
                <th className="py-3 px-4">75% (Q3)</th>
                <th className="py-3 px-4">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {eda.numeric_features.map((feat) => {
                const s = eda.summary_stats[feat];
                return (
                  <tr key={feat} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-4 font-sans font-bold text-slate-100">{feat}</td>
                    <td className="py-2.5 px-4 text-emerald-400 font-semibold">{s.mean}</td>
                    <td className="py-2.5 px-4 text-slate-400">{s.std}</td>
                    <td className="py-2.5 px-4 text-slate-400">{s.min}</td>
                    <td className="py-2.5 px-4 text-slate-400">{s.q25}</td>
                    <td className="py-2.5 px-4 text-cyan-400 font-semibold">{s.median}</td>
                    <td className="py-2.5 px-4 text-slate-400">{s.q75}</td>
                    <td className="py-2.5 px-4 text-slate-400">{s.max}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Correlation Heatmap */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            Feature Pearson Correlation Heatmap
          </h3>

          <div className="overflow-x-auto pb-2">
            <table className="w-full text-[11px] font-mono text-center">
              <thead>
                <tr>
                  <th className="p-2 text-left text-slate-500 font-normal">Feature</th>
                  {eda.numeric_features.map((f) => (
                    <th key={f} className="p-2 text-slate-400 font-normal truncate max-w-[60px]" title={f}>
                      {f.slice(0, 6)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {eda.numeric_features.map((rowFeat) => (
                  <tr key={rowFeat}>
                    <td className="p-2 text-left font-sans font-semibold text-slate-300 truncate max-w-[100px]">
                      {rowFeat}
                    </td>
                    {eda.numeric_features.map((colFeat) => {
                      const val = eda.correlation_matrix[rowFeat]?.[colFeat] || 0;
                      const intensity = Math.abs(val);
                      const bg = val > 0 
                        ? `rgba(16, 185, 129, ${Math.max(intensity * 0.85, 0.1)})`
                        : `rgba(244, 63, 94, ${Math.max(intensity * 0.85, 0.1)})`;

                      return (
                        <td
                          key={colFeat}
                          style={{ backgroundColor: bg }}
                          className="p-2 rounded border border-slate-900 text-slate-100 font-semibold"
                          title={`${rowFeat} vs ${colFeat}: ${val}`}
                        >
                          {val.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Notice strong positive correlation between <strong className="text-emerald-400">Spending Score & Frequency</strong>, and <strong className="text-cyan-400">Annual Income & Monetary Value</strong>.
          </p>
        </div>

        {/* Feature Distribution Histogram */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Distribution Histogram
            </h3>

            {/* Feature Picker */}
            <select
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
            >
              {eda.numeric_features.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Histogram Bars */}
          <div className="h-56 bg-slate-950 rounded-xl border border-slate-800 p-4 flex items-end gap-2">
            {activeHist && activeHist.counts.map((count, idx) => {
              const heightPct = (count / maxCount) * 100;
              const binStart = activeHist.bin_edges[idx];
              const binEnd = activeHist.bin_edges[idx + 1];

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <span className="text-[9px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {count}
                  </span>
                  <div
                    style={{ height: `${Math.max(heightPct, 4)}%` }}
                    className="w-full rounded-t bg-gradient-to-t from-emerald-600 to-cyan-400 group-hover:from-emerald-400 group-hover:to-cyan-300 transition-all cursor-pointer shadow"
                    title={`Bin [${binStart} - ${binEnd}]: ${count} customers`}
                  />
                  <span className="text-[8px] font-mono text-slate-500 truncate w-full text-center">
                    {binStart}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>Min: {activeHist?.bin_edges[0]}</span>
            <span>Feature: {selectedFeature}</span>
            <span>Max: {activeHist?.bin_edges[activeHist.bin_edges.length - 1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
