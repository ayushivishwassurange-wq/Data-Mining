import React, { useState, useEffect } from 'react';
import { Network, Sparkles, Layers, Eye, Info, RefreshCw, Cpu } from 'lucide-react';
import { api } from '../api/client';
import { AttentionResult } from '../types';

const SAMPLE_TEXTS = [
  'CRISP-DM pipeline for machine learning',
  'Rotary position embeddings in transformers',
  'Self attention calculates token weights',
  'Python function returns predictions'
];

export const AttentionVisualizer: React.FC = () => {
  const [inputText, setInputText] = useState(SAMPLE_TEXTS[0]);
  const [loading, setLoading] = useState(false);
  const [attentionData, setAttentionData] = useState<AttentionResult | null>(null);
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [selectedHead, setSelectedHead] = useState<number | 'all'>(0);
  const [hoveredCell, setHoveredCell] = useState<{
    qIdx: number;
    kIdx: number;
    qToken: string;
    kToken: string;
    val: number;
  } | null>(null);

  const fetchAttention = async (text: string) => {
    try {
      setLoading(true);
      const res = await api.inspectAttention(text);
      setAttentionData(res);
      if (selectedLayer >= res.n_layers) setSelectedLayer(0);
    } catch (err) {
      console.error('Failed to fetch attention:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttention(inputText);
  }, []);

  // Compute current matrix based on selected head or average of all heads
  const getDisplayMatrix = (): number[][] => {
    if (!attentionData || !attentionData.layers[selectedLayer]) return [];
    const layer = attentionData.layers[selectedLayer];
    const seqLen = attentionData.tokens.length;

    if (selectedHead === 'all') {
      // Average across all heads
      const avg: number[][] = Array(seqLen).fill(0).map(() => Array(seqLen).fill(0));
      const numHeads = layer.heads.length;
      for (let h = 0; h < numHeads; h++) {
        for (let i = 0; i < seqLen; i++) {
          for (let j = 0; j < seqLen; j++) {
            avg[i][j] += (layer.heads[h][i]?.[j] || 0) / numHeads;
          }
        }
      }
      return avg;
    } else {
      return layer.heads[selectedHead] || [];
    }
  };

  const matrix = getDisplayMatrix();
  const tokens = attentionData?.tokens || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Concept Explanation */}
      <div className="bg-slate-900/90 border border-purple-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                <Network className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                Multi-Head Self-Attention Heatmap Explorer
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Inspect how each token dynamically attends to past context across all 4 Transformer Layers and 4 Attention Heads. 
              Calculated via scaled dot-product: <code className="text-purple-300 font-mono bg-purple-950/60 px-2 py-0.5 rounded">Attention(Q, K, V) = softmax(Q·Kᵀ / √d_k) · V</code>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>RoPE & Causal Mask Active</span>
          </div>
        </div>
      </div>

      {/* Input Selector & Presets */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter any custom sentence to visualize attention..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={() => fetchAttention(inputText)}
            disabled={loading || !inputText.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-lg shadow-purple-900/30 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Compute Heatmap</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider shrink-0">
            Presets:
          </span>
          {SAMPLE_TEXTS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(sample);
                fetchAttention(sample);
              }}
              className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-purple-300 px-3 py-1 rounded-md shrink-0 border border-slate-700/50 transition-all"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Visualizer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Heatmap Canvas */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          {/* Controls Bar: Layers & Heads */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            {/* Layer Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <span className="text-xs font-semibold text-slate-500 px-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Layer:
              </span>
              {[0, 1, 2, 3].map((l) => (
                <button
                  key={l}
                  onClick={() => setSelectedLayer(l)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    selectedLayer === l
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Layer {l + 1}
                </button>
              ))}
            </div>

            {/* Head Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <span className="text-xs font-semibold text-slate-500 px-2 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Head:
              </span>
              {[0, 1, 2, 3].map((h) => (
                <button
                  key={h}
                  onClick={() => setSelectedHead(h)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    selectedHead === h
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Head {h + 1}
                </button>
              ))}
              <button
                onClick={() => setSelectedHead('all')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  selectedHead === 'all'
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Avg All Heads
              </button>
            </div>
          </div>

          {/* Heatmap Grid */}
          {loading ? (
            <div className="h-80 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400 font-mono">Running forward pass & extracting attention tensors...</p>
            </div>
          ) : tokens.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-slate-500 text-sm">
              No attention data available. Enter text and click compute.
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <div className="inline-block min-w-full">
                {/* Column Headers (Keys) */}
                <div className="flex items-end pl-24 mb-2">
                  {tokens.map((token, kIdx) => (
                    <div
                      key={kIdx}
                      className="w-12 text-center text-[10px] font-mono font-medium text-slate-400 truncate px-0.5 transform -rotate-45 origin-bottom-left"
                      title={`Key Token: ${token}`}
                    >
                      {token}
                    </div>
                  ))}
                </div>

                {/* Rows (Queries) */}
                <div className="space-y-1">
                  {tokens.map((qToken, qIdx) => (
                    <div key={qIdx} className="flex items-center">
                      {/* Row Label (Query Token) */}
                      <div
                        className="w-24 text-right pr-3 text-[11px] font-mono font-semibold text-slate-300 truncate"
                        title={`Query Token: ${qToken}`}
                      >
                        {qToken}
                      </div>

                      {/* Row Cells */}
                      <div className="flex gap-1">
                        {tokens.map((kToken, kIdx) => {
                          const val = matrix[qIdx]?.[kIdx] || 0;
                          const isCausalMasked = kIdx > qIdx;
                          const intensity = Math.min(Math.max(val, 0), 1);
                          
                          // Color mapping from deep slate to vibrant purple/cyan
                          const bgColor = isCausalMasked 
                            ? 'rgba(15, 23, 42, 0.3)' 
                            : `rgba(139, 92, 246, ${Math.max(intensity * 0.95, 0.08)})`;

                          return (
                            <div
                              key={kIdx}
                              onMouseEnter={() => setHoveredCell({
                                qIdx,
                                kIdx,
                                qToken,
                                kToken,
                                val
                              })}
                              onMouseLeave={() => setHoveredCell(null)}
                              style={{ backgroundColor: bgColor }}
                              className={`w-12 h-10 rounded flex items-center justify-center text-[10px] font-mono transition-transform duration-150 cursor-pointer ${
                                isCausalMasked
                                  ? 'text-slate-700 border border-slate-900'
                                  : 'text-slate-100 hover:scale-110 hover:z-10 hover:ring-2 hover:ring-purple-400 border border-purple-500/20 shadow-sm'
                              }`}
                            >
                              {isCausalMasked ? '—' : (val > 0.01 ? (val).toFixed(2) : '.00')}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Hover Cell Inspector */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
            {hoveredCell ? (
              <div className="flex items-center gap-4 text-slate-300">
                <span>Query <strong className="text-purple-400">"{hoveredCell.qToken}"</strong></span>
                <span>→ Attends to Key <strong className="text-cyan-400">"{hoveredCell.kToken}"</strong></span>
                <span>Weight: <strong className="text-amber-400">{(hoveredCell.val * 100).toFixed(1)}%</strong></span>
              </div>
            ) : (
              <span className="text-slate-500">Hover over any matrix cell to inspect exact Query-Key attention weight percentage</span>
            )}

            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span>Low (0%)</span>
              <div className="w-16 h-2 rounded bg-gradient-to-r from-purple-900/30 to-purple-500" />
              <span>High (100%)</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Educational Architecture Sidebar */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-400" />
              Understanding Attention
            </h3>

            <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-purple-300 block mb-1">1. Causal Triangular Masking</span>
                Tokens can only attend to previous tokens (j &le; i). Future positions (j &gt; i) are masked with -&infin; to preserve strict autoregressive causality.

              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-cyan-300 block mb-1">2. Multi-Head Specialization</span>
                With 4 heads, each head learns distinct syntactic and semantic relationships (e.g., Head 1 tracks grammar subjects, Head 2 tracks nouns, Head 3 tracks punctuation).
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-amber-300 block mb-1">3. RoPE Angle Encoding</span>
                Rotary Position Embeddings rotate Query & Key vectors so token attention naturally attenuates as relative distance increases.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
