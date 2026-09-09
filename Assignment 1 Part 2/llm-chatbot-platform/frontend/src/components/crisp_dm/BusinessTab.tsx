import React from 'react';
import { Target, Zap, ShieldCheck, DollarSign, CheckCircle2 } from 'lucide-react';

export const BusinessTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Phase 1: Business Understanding</h3>
            <p className="text-xs text-slate-400">Problem Framing, Objectives & Deployment Constraints</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Commercial Large Language Models (e.g. GPT-4, Claude 3) incur costly cloud API tariffs, high network roundtrip latency, and potential privacy risks when transmitting proprietary conversational data. 
          The business objective of this project is to build a completely self-contained, open-architecture, and state-of-the-art <strong>Mini-LLM</strong> that can be trained and run locally on consumer laptop CPUs or discrete GPUs with zero API fees, sub-5ms latency, and 100% data privacy.
        </p>

        {/* Business KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">API Cost</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">$0.00 / month</div>
            <p className="text-[11px] text-slate-500 mt-1">100% on-device local execution</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Token Latency</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">&lt; 5 ms / token</div>
            <p className="text-[11px] text-slate-500 mt-1">&gt; 200 tokens/sec streaming</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Data Privacy</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">Zero Leakage</div>
            <p className="text-[11px] text-slate-500 mt-1">No telemetry sent outside laptop</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">RAM Footprint</span>
            </div>
            <div className="text-2xl font-bold text-slate-100">&lt; 40 MB</div>
            <p className="text-[11px] text-slate-500 mt-1">Runs smoothly in any background thread</p>
          </div>
        </div>
      </div>
    </div>
  );
};
