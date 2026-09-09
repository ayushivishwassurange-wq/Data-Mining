import React from 'react';
import { Database, FileText, BarChart2, PieChart } from 'lucide-react';

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
            <p className="text-xs text-slate-400">Multi-Turn Instruction Corpus & Domain Distributions</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Training an effective compact language model requires curated, high-density instructional dialogs spanning data science definitions, Python syntax, transformer architecture concepts, and conversational greeting patterns.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <PieChart className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">Domain Distribution</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex justify-between">
                <span>CRISP-DM & Data Mining:</span>
                <strong className="text-slate-200">30%</strong>
              </li>
              <li className="flex justify-between">
                <span>Transformer Mechanics:</span>
                <strong className="text-slate-200">25%</strong>
              </li>
              <li className="flex justify-between">
                <span>Python & Code Syntax:</span>
                <strong className="text-slate-200">25%</strong>
              </li>
              <li className="flex justify-between">
                <span>Conversational Dialogue:</span>
                <strong className="text-slate-200">20%</strong>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <FileText className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">Corpus Profiling</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex justify-between">
                <span>Total Sequences:</span>
                <strong className="text-slate-200">360 augmented dialogs</strong>
              </li>
              <li className="flex justify-between">
                <span>Average Sequence Length:</span>
                <strong className="text-slate-200">48 tokens</strong>
              </li>
              <li className="flex justify-between">
                <span>Max Context Length:</span>
                <strong className="text-slate-200">128 tokens</strong>
              </li>
              <li className="flex justify-between">
                <span>Unique Special Tokens:</span>
                <strong className="text-slate-200">7 control tags</strong>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <BarChart2 className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">Token Frequency</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subword frequencies follow Zipf's law distribution. Frequent subwords (e.g. <code>CRISP-DM</code>, <code>def </code>, <code>attention</code>) are unified into single token IDs to minimize sequence expansion and maximize inference throughput.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
