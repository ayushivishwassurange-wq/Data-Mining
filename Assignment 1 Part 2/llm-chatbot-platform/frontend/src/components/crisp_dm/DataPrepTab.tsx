import React from 'react';
import { Filter, Layers, Code2, ArrowRight } from 'lucide-react';

export const DataPrepTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <Filter className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Phase 3: Data Preparation</h3>
            <p className="text-xs text-slate-400">Autoregressive Formatting, Shifting & Masking</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Raw text dialogues are converted into autoregressive token pairs using causal next-token shifting and padding masks:
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4" /> 1. Chat Template Formatting
            </h4>
            <pre className="text-xs font-mono text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800 overflow-x-auto">
              {"<|system|> You are an expert data scientist.\n<|user|> What is CRISP-DM?\n<|assistant|> CRISP-DM is the Cross-Industry Standard Process for Data Mining.<|eos|>"}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                2. Input / Target Token Shift
              </h4>
              <p className="text-xs text-slate-400">
                Input tensor: <code className="text-purple-300 font-mono">x = sequence[:-1]</code><br/>
                Target tensor: <code className="text-cyan-300 font-mono">y = sequence[1:]</code>
              </p>
              <p className="text-[11px] text-slate-500">
                Ensures at step <em>t</em>, the model receives context <em>(x₀...xₜ)</em> to predict next token <em>xₜ₊₁</em>.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                3. Loss Padding Masking
              </h4>
              <p className="text-xs text-slate-400">
                Padding tokens are set to <code className="text-rose-300 font-mono">target = -1</code>.<br/>
                PyTorch Cross-Entropy ignores these indices via <code className="text-emerald-300 font-mono">ignore_index=-1</code>.
              </p>
              <p className="text-[11px] text-slate-500">
                Prevents backpropagating gradients into artificial padding positions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
