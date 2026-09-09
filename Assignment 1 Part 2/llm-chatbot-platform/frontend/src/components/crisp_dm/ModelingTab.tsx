import React from 'react';
import { Cpu, Zap, GitCommit, Layers, CheckCircle2 } from 'lucide-react';

export const ModelingTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Phase 4: Modeling</h3>
            <p className="text-xs text-slate-400">Decoder-Only Architecture with SOTA Primitives</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          MiniLLM uses the same foundational architecture primitives as modern state-of-the-art models like LLaMA 3 and Mistral:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400">
              <Zap className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">Rotary Positional Embeddings (RoPE)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Rotates Q & K vectors in 2D coordinate subspaces:
              <br/>
              <code className="text-purple-300 font-mono">R_θ,m · x_m</code> preserves relative distance without adding static vectors.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Layers className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">SwiGLU Gated Feed-Forward</h4>
            </div>
            <p className="text-xs text-slate-400">
              Gated activation mechanism:
              <br/>
              <code className="text-cyan-300 font-mono">SwiGLU(x) = (SiLU(xW_gate) ⊙ xW_up) · W_down</code>
              <br/>Provides superior gradient flow over standard ReLU/GELU MLPs.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">RMSNorm Pre-Normalization</h4>
            </div>
            <p className="text-xs text-slate-400">
              Root Mean Square Normalization without mean-centering:
              <br/>
              <code className="text-emerald-300 font-mono">x / RMS(x) · γ</code> reduces compute latency by 15-20%.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <GitCommit className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">AdamW + Cosine Annealing</h4>
            </div>
            <p className="text-xs text-slate-400">
              Decoupled weight decay (0.01) with smooth cosine learning rate annealing schedule from 3e-3 down to 1e-4 across 25 epochs.
            </p>
          </div>
        </div>

        {/* Parameter Summary Table */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 font-semibold text-xs text-slate-300">
            Model Configuration Blueprint
          </div>
          <table className="w-full text-xs text-slate-300">
            <tbody>
              <tr className="border-b border-slate-800/60">
                <td className="px-4 py-2 font-mono text-purple-400">Architecture</td>
                <td className="px-4 py-2">Decoder-Only Causal Autoregressive Transformer</td>
              </tr>
              <tr className="border-b border-slate-800/60">
                <td className="px-4 py-2 font-mono text-purple-400">Parameters</td>
                <td className="px-4 py-2 font-semibold">884,864 (~0.88M parameters)</td>
              </tr>
              <tr className="border-b border-slate-800/60">
                <td className="px-4 py-2 font-mono text-purple-400">Layers / Heads</td>
                <td className="px-4 py-2">4 Transformer Blocks / 4 Multi-Head Attention</td>
              </tr>
              <tr className="border-b border-slate-800/60">
                <td className="px-4 py-2 font-mono text-purple-400">Embedding / MLP Dim</td>
                <td className="px-4 py-2">d_model = 128 / hidden_dim = 384</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-purple-400">Weight Tying</td>
                <td className="px-4 py-2">tok_embeddings.weight == lm_head.weight (memory saved)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
