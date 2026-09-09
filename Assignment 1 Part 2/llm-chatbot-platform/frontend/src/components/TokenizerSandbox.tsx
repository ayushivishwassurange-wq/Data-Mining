import React, { useState, useEffect } from 'react';
import { Binary, Sparkles, Hash, Layers, Search, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../api/client';
import { TokenizeResult } from '../types';

const TOKEN_COLORS = [
  'bg-purple-600/30 text-purple-200 border-purple-500/40 hover:bg-purple-600/50',
  'bg-blue-600/30 text-blue-200 border-blue-500/40 hover:bg-blue-600/50',
  'bg-emerald-600/30 text-emerald-200 border-emerald-500/40 hover:bg-emerald-600/50',
  'bg-amber-600/30 text-amber-200 border-amber-500/40 hover:bg-amber-600/50',
  'bg-rose-600/30 text-rose-200 border-rose-500/40 hover:bg-rose-600/50',
  'bg-cyan-600/30 text-cyan-200 border-cyan-500/40 hover:bg-cyan-600/50',
  'bg-violet-600/30 text-violet-200 border-violet-500/40 hover:bg-violet-600/50',
  'bg-indigo-600/30 text-indigo-200 border-indigo-500/40 hover:bg-indigo-600/50',
];

const PRESETS = [
  '<|system|>You are a helpful AI assistant.\n<|user|>Explain the CRISP-DM framework.<|assistant|>',
  'def predict_fare(pickup_lat, dropoff_lat):\n    return model.predict([[pickup_lat, dropoff_lat]])',
  'Self-Attention and Rotary Position Embeddings (RoPE) enable fast autoregressive decoding.',
  'Machine learning algorithms optimize Cross-Entropy Loss to minimize Perplexity.'
];

export const TokenizerSandbox: React.FC = () => {
  const [inputText, setInputText] = useState(PRESETS[0]);
  const [tokenizeResult, setTokenizeResult] = useState<TokenizeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSegmentIdx, setSelectedSegmentIdx] = useState<number | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const handleTokenize = async (text: string) => {
    try {
      setLoading(true);
      const res = await api.tokenize(text);
      setTokenizeResult(res);
      setSelectedSegmentIdx(null);
    } catch (err) {
      console.error('Tokenization failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleTokenize(inputText);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-purple-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Binary className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                MiniTokenizer Subword & Character Sandbox
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Understand how natural language text and control tags are transformed into discrete integer tokens with greedy longest-prefix matching.
            </p>
          </div>

          {tokenizeResult && (
            <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500 block">Characters</span>
                <strong className="text-slate-200 text-sm">{tokenizeResult.character_count}</strong>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block">Tokens</span>
                <strong className="text-purple-400 text-sm">{tokenizeResult.token_count}</strong>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block">Compression</span>
                <strong className="text-emerald-400 text-sm">{tokenizeResult.compression_ratio}x</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Input Text / Prompt Sandbox
          </label>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-500 font-semibold mr-1">Presets:</span>
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputText(p);
                  handleTokenize(p);
                }}
                className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700/60"
              >
                Sample {i + 1}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            handleTokenize(e.target.value);
          }}
          placeholder="Type or paste any text to see token boundaries..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
        />

        {/* Visual Token Stream */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Segmented Token Badges (Click any token to inspect)
          </h3>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 min-h-[120px] flex flex-wrap gap-2 items-center leading-loose">
            {loading ? (
              <span className="text-xs text-slate-500 font-mono">Tokenizing sequence...</span>
            ) : tokenizeResult && tokenizeResult.segments.length > 0 ? (
              tokenizeResult.segments.map((seg, idx) => {
                const colorClass = seg.is_special
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                  : TOKEN_COLORS[idx % TOKEN_COLORS.length];
                const isSelected = selectedSegmentIdx === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedSegmentIdx(idx)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all duration-150 ${colorClass} ${
                      isSelected ? 'ring-2 ring-purple-400 scale-105 z-10 shadow-lg' : ''
                    }`}
                  >
                    <span className="font-semibold">{seg.token === '\n' ? '↵' : seg.token === ' ' ? '␣' : seg.token}</span>
                    <span className="text-[10px] opacity-60">#{seg.token_id}</span>
                  </button>
                );
              })
            ) : (
              <span className="text-xs text-slate-600">Enter text above to preview token badges.</span>
            )}
          </div>
        </div>

        {/* Selected Token Inspector Card */}
        {selectedSegmentIdx !== null && tokenizeResult && (
          <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold text-sm">
                Token: "{tokenizeResult.segments[selectedSegmentIdx].token}"
              </div>
              <div className="text-slate-300">
                Token ID: <strong className="text-purple-300">#{tokenizeResult.segments[selectedSegmentIdx].token_id}</strong>
              </div>
              <div className="text-slate-300">
                Span: <strong className="text-cyan-300">[{tokenizeResult.segments[selectedSegmentIdx].start}:{tokenizeResult.segments[selectedSegmentIdx].end}]</strong>
              </div>
              <div className="text-slate-300">
                Type: <strong className={tokenizeResult.segments[selectedSegmentIdx].is_special ? "text-rose-400 font-bold" : "text-emerald-400"}>
                  {tokenizeResult.segments[selectedSegmentIdx].is_special ? "Special Control Token" : "Standard Vocabulary Subword"}
                </strong>
              </div>
            </div>
            <button
              onClick={() => setSelectedSegmentIdx(null)}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Integer Token IDs Tensor Representation */}
      {tokenizeResult && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Hash className="w-4 h-4 text-cyan-400" />
            PyTorch Input Tensor: <code>torch.tensor([token_ids], dtype=torch.long)</code>
          </h3>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 break-all leading-relaxed">
            [{tokenizeResult.token_ids.join(', ')}]
          </div>
        </div>
      )}
    </div>
  );
};
