import React, { useState, useEffect } from 'react';
import { 
  TableProperties, 
  Sliders, 
  Search, 
  ArrowUpDown, 
  RefreshCw, 
  Sparkles, 
  ScatterChart, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api/client';
import { RuleEntry, MineRulesResult } from '../types';

export const RuleExplorer: React.FC = () => {
  const [rules, setRules] = useState<RuleEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [algorithm, setAlgorithm] = useState<'fp_growth' | 'apriori' | 'eclat'>('fp_growth');
  const [minSupport, setMinSupport] = useState(0.03);
  const [minConfidence, setMinConfidence] = useState(0.25);
  const [minLift, setMinLift] = useState(1.1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof RuleEntry>('lift');
  const [sortAsc, setSortAsc] = useState(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [totalItemsets, setTotalItemsets] = useState<number>(0);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const res = await api.mineRules({
        algorithm,
        min_support: minSupport,
        min_confidence: minConfidence,
        min_lift: minLift,
        max_rules: 150,
      });
      setRules(res.rules);
      setExecutionTime(res.execution_time_ms);
      setTotalItemsets(res.total_frequent_itemsets);
    } catch (err) {
      console.error('Failed to mine rules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleSort = (field: keyof RuleEntry) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filteredRules = rules.filter(r => 
    r.rule_str.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedRules = [...filteredRules].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc 
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <TableProperties className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                Association Rule Explorer & Quality Metrics
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Inspect mined association rules evaluated across <strong>Support</strong>, <strong>Confidence</strong>, <strong>Lift</strong>, <strong>Leverage</strong>, <strong>Conviction</strong>, and <strong>Zhang's Directional Metric</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Itemsets</span>
              <strong className="text-amber-400 text-sm">{totalItemsets}</strong>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block">Mined Rules</span>
              <strong className="text-emerald-400 text-sm">{rules.length}</strong>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block">Speed</span>
              <strong className="text-cyan-400 text-sm">{executionTime}ms</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Mining Configuration Drawer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 font-mono">
            <Sliders className="w-4 h-4 text-amber-400" />
            Dynamic Mining Parameter Sliders
          </h3>

          {/* Algorithm Picker */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setAlgorithm('fp_growth')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                algorithm === 'fp_growth' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FP-Growth (Fast)
            </button>
            <button
              onClick={() => setAlgorithm('apriori')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                algorithm === 'apriori' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Apriori (Level-wise)
            </button>
            <button
              onClick={() => setAlgorithm('eclat')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                algorithm === 'eclat' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ECLAT (Tidset)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          {/* Min Support */}
          <div>
            <div className="flex justify-between mb-1 text-slate-300">
              <span>Min Support</span>
              <strong className="text-amber-400">{(minSupport * 100).toFixed(1)}%</strong>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.15"
              step="0.005"
              value={minSupport}
              onChange={(e) => setMinSupport(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Min Confidence */}
          <div>
            <div className="flex justify-between mb-1 text-slate-300">
              <span>Min Confidence</span>
              <strong className="text-emerald-400">{(minConfidence * 100).toFixed(0)}%</strong>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.05"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Min Lift */}
          <div>
            <div className="flex justify-between mb-1 text-slate-300">
              <span>Min Lift</span>
              <strong className="text-cyan-400">{minLift.toFixed(1)}x</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.1"
              value={minLift}
              onChange={(e) => setMinLift(parseFloat(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Mine Button */}
          <div className="flex items-end">
            <button
              onClick={fetchRules}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Mining...' : 'Mine Association Rules'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Support vs Confidence Scatter Plot Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <ScatterChart className="w-4 h-4 text-emerald-400" />
            Support vs Confidence Matrix (Points colored & sized by Lift)
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Optimal Rules: Top-Right Quadrant (High Support & High Confidence)
          </span>
        </div>

        <div className="h-56 bg-slate-950 rounded-xl border border-slate-800 p-4 relative flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
            {/* Grid */}
            <line x1="0" y1="0" x2="500" y2="0" stroke="#1e293b" strokeDasharray="3" />
            <line x1="0" y1="90" x2="500" y2="90" stroke="#1e293b" strokeDasharray="3" />
            <line x1="0" y1="180" x2="500" y2="180" stroke="#334155" />

            {/* Rule Scatter Points */}
            {rules.slice(0, 100).map((r, i) => {
              // Support: 0.01 to 0.15 -> X: 0 to 500
              const cx = ((r.support - 0.01) / (0.15 - 0.01)) * 480 + 10;
              // Confidence: 0.1 to 1.0 -> Y: 180 to 0
              const cy = 180 - ((r.confidence - 0.1) / (1.0 - 0.1)) * 160 - 10;
              const radius = Math.min(Math.max((r.lift - 1.0) * 2 + 3, 3), 8);
              const color = r.lift >= 3.5 ? '#f59e0b' : r.lift >= 2.0 ? '#10b981' : '#38bdf8';

              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill={color}
                  opacity={0.8}
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  className="hover:scale-125 transition-all cursor-pointer"
                >
                  <title>{`${r.rule_str}\nSupport: ${(r.support*100).toFixed(1)}%\nConfidence: ${(r.confidence*100).toFixed(1)}%\nLift: ${r.lift}x`}</title>
                </circle>
              );
            })}
          </svg>
        </div>
        <div className="flex justify-between text-[11px] font-mono text-slate-500">
          <span>Support 1%</span>
          <span>Support 8%</span>
          <span>Support 15% (Y-axis: Confidence 10% ➔ 100%)</span>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <TableProperties className="w-4 h-4 text-amber-400" />
            Ranked Association Rules Table ({sortedRules.length})
          </h3>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product in rules..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] sticky top-0 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Rule (Antecedent ➔ Consequent)</th>
                <th onClick={() => handleSort('support')} className="py-3 px-3 cursor-pointer hover:text-amber-400">
                  <div className="flex items-center gap-1">Support <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('confidence')} className="py-3 px-3 cursor-pointer hover:text-amber-400">
                  <div className="flex items-center gap-1">Confidence <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('lift')} className="py-3 px-3 cursor-pointer hover:text-amber-400">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">Lift <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('leverage')} className="py-3 px-3 cursor-pointer hover:text-amber-400">
                  <div className="flex items-center gap-1">Leverage <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('conviction')} className="py-3 px-3 cursor-pointer hover:text-amber-400">
                  <div className="flex items-center gap-1">Conviction <ArrowUpDown className="w-3 h-3" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {sortedRules.slice(0, 100).map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-sans">
                    <span className="font-semibold text-amber-300">{r.antecedent_str}</span>
                    <span className="text-slate-500 mx-2">➔</span>
                    <span className="font-semibold text-teal-300">{r.consequent_str}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{(r.support * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold">{(r.confidence * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-amber-400 font-bold">{r.lift}x</td>
                  <td className="py-2.5 px-3 text-slate-400">{r.leverage}</td>
                  <td className="py-2.5 px-3 text-cyan-400">{r.conviction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
