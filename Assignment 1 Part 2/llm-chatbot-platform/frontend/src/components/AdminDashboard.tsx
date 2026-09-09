import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  Zap, 
  Activity, 
  TrendingDown, 
  Award, 
  RefreshCw, 
  Sliders, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Flame
} from 'lucide-react';
import { api } from '../api/client';
import { ModelTelemetry, TrainingHistory } from '../types';
import { BusinessTab } from './crisp_dm/BusinessTab';
import { DataUnderstandingTab } from './crisp_dm/DataUnderstandingTab';
import { DataPrepTab } from './crisp_dm/DataPrepTab';
import { ModelingTab } from './crisp_dm/ModelingTab';
import { EvaluationTab } from './crisp_dm/EvaluationTab';
import { DeploymentTab } from './crisp_dm/DeploymentTab';
import confetti from 'canvas-confetti';

export const AdminDashboard: React.FC = () => {
  const [telemetry, setTelemetry] = useState<ModelTelemetry | null>(null);
  const [history, setHistory] = useState<TrainingHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeCrispTab, setActiveCrispTab] = useState(1);

  // Live Fine-Tuning State
  const [fineTuneText, setFineTuneText] = useState('CRISP-DM is the global standard data mining methodology.');
  const [fineTuneEpochs, setFineTuneEpochs] = useState(3);
  const [fineTuning, setFineTuning] = useState(false);
  const [fineTuneResult, setFineTuneResult] = useState<{
    losses: number[];
    final_loss: number;
    perplexity: number;
  } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tel, hist] = await Promise.all([
        api.getTelemetry(),
        api.getTrainingHistory()
      ]);
      setTelemetry(tel);
      setHistory(hist);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFineTune = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fineTuneText.trim() || fineTuning) return;

    try {
      setFineTuning(true);
      const res = await api.fineTune(fineTuneText, fineTuneEpochs);
      setFineTuneResult(res);
      fetchData(); // Refresh telemetry
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#8b5cf6', '#10b981', '#38bdf8']
      });
    } catch (err) {
      console.error('Fine-tuning failed:', err);
    } finally {
      setFineTuning(false);
    }
  };

  const crispTabs = [
    { id: 1, name: '1. Business', component: BusinessTab },
    { id: 2, name: '2. Data Understanding', component: DataUnderstandingTab },
    { id: 3, name: '3. Data Prep', component: DataPrepTab },
    { id: 4, name: '4. Modeling', component: ModelingTab },
    { id: 5, name: '5. Evaluation', component: EvaluationTab },
    { id: 6, name: '6. Deployment', component: DeploymentTab },
  ];

  const CurrentCrispComponent = crispTabs.find(t => t.id === activeCrispTab)?.component || BusinessTab;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-purple-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                CRISP-DM & Mini-LLM Data Science Admin Dashboard
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Real-time model performance, loss convergence curves, hardware telemetry, interactive fine-tuning and full 6-phase CRISP-DM methodology lifecycle tracking.
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 shadow transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Real-Time Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Trainable Params</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {telemetry ? `${(telemetry.parameters / 1e3).toFixed(0)}k` : '885k'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">4 Layers • 4 Heads • d=128</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Final Loss</span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {telemetry ? telemetry.final_train_loss.toFixed(4) : '0.0239'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Cross-Entropy Loss</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Perplexity (PPL)</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400">
            {telemetry ? telemetry.final_perplexity.toFixed(2) : '1.02'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{'PPL = exp(Loss)'}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Vocab Size</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {telemetry ? telemetry.vocab_size : 248} tokens
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Subwords + Special Chat</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Training Time</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {telemetry ? `${telemetry.training_time_seconds}s` : '76s'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{`Device: ${telemetry?.device?.toUpperCase() || 'CPU'}`}</p>
        </div>
      </div>

      {/* SVG Training Loss & Perplexity Convergence Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loss Curve */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-purple-400" />
              Loss Convergence History (25 Epochs)
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Train Loss
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Val Loss
              </span>
            </div>
          </div>

          <div className="h-56 bg-slate-950 rounded-xl border border-slate-800 p-4 relative flex items-end">
            {history && history.train_loss.length > 0 ? (
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="0" x2="500" y2="0" stroke="#1e293b" strokeDasharray="4" />
                <line x1="0" y1="45" x2="500" y2="45" stroke="#1e293b" strokeDasharray="4" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#1e293b" strokeDasharray="4" />
                <line x1="0" y1="135" x2="500" y2="135" stroke="#1e293b" strokeDasharray="4" />
                <line x1="0" y1="180" x2="500" y2="180" stroke="#334155" />

                {/* Train Loss Path */}
                <polyline
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="3"
                  points={history.train_loss.map((loss, idx) => {
                    const x = (idx / (history.train_loss.length - 1)) * 500;
                    const maxLoss = 4.5;
                    const y = 180 - (Math.min(loss, maxLoss) / maxLoss) * 160 - 10;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                {/* Val Loss Path */}
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  points={history.val_loss.map((loss, idx) => {
                    const x = (idx / (history.val_loss.length - 1)) * 500;
                    const maxLoss = 4.5;
                    const y = 180 - (Math.min(loss, maxLoss) / maxLoss) * 160 - 10;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              </svg>
            ) : (
              <div className="flex items-center justify-center w-full text-xs text-slate-500">
                Loading loss curve data...
              </div>
            )}
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>Epoch 1 (Loss ~4.08)</span>
            <span>Epoch 12</span>
            <span>Epoch 25 (Loss ~0.02)</span>
          </div>
        </div>

        {/* Perplexity Curve & LR Decay */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              Perplexity & Cosine LR Decay Schedule
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Perplexity (PPL)
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> LR Schedule
              </span>
            </div>
          </div>

          <div className="h-56 bg-slate-950 rounded-xl border border-slate-800 p-4 relative flex items-end">
            {history && history.train_perplexity.length > 0 ? (
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="0" x2="500" y2="0" stroke="#1e293b" strokeDasharray="4" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#1e293b" strokeDasharray="4" />
                <line x1="0" y1="180" x2="500" y2="180" stroke="#334155" />

                {/* Perplexity Path (log scale visual) */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  points={history.train_perplexity.map((ppl, idx) => {
                    const x = (idx / (history.train_perplexity.length - 1)) * 500;
                    const maxPpl = 60.0;
                    const y = 180 - (Math.min(ppl, maxPpl) / maxPpl) * 160 - 10;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                {/* Learning Rate Cosine Schedule */}
                <polyline
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  points={history.learning_rate.map((lr, idx) => {
                    const x = (idx / (history.learning_rate.length - 1)) * 500;
                    const maxLr = 0.003;
                    const y = 180 - (lr / maxLr) * 160 - 10;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              </svg>
            ) : (
              <div className="flex items-center justify-center w-full text-xs text-slate-500">
                Loading perplexity curves...
              </div>
            )}
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>PPL 59.16 (LR: 3e-3)</span>
            <span>Cosine Decay</span>
            <span>PPL 1.02 (LR: 1e-4)</span>
          </div>
        </div>
      </div>

      {/* Live Interactive Fine-Tuning Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Live On-Device Fine-Tuning</h3>
            <p className="text-xs text-slate-400">
              Inject custom user knowledge by executing live AdamW gradient steps directly in PyTorch on your laptop.
            </p>
          </div>
        </div>

        <form onSubmit={handleFineTune} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              value={fineTuneText}
              onChange={(e) => setFineTuneText(e.target.value)}
              placeholder="Enter sentence to fine-tune on..."
              className="sm:col-span-3 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <div className="flex gap-2">
              <select
                value={fineTuneEpochs}
                onChange={(e) => setFineTuneEpochs(parseInt(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value={1}>1 Step</option>
                <option value={3}>3 Steps</option>
                <option value={5}>5 Steps</option>
              </select>
              <button
                type="submit"
                disabled={fineTuning || !fineTuneText.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-medium text-xs shadow-lg shadow-purple-900/40 transition-all disabled:opacity-50"
              >
                <Flame className={`w-4 h-4 ${fineTuning ? 'animate-bounce' : ''}`} />
                <span>{fineTuning ? 'Optimizing...' : 'Fine-Tune'}</span>
              </button>
            </div>
          </div>
        </form>

        {fineTuneResult && (
          <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Fine-Tuning Succeeded!</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <span>Epoch Losses: <strong className="text-purple-300">[{fineTuneResult.losses.join(', ')}]</strong></span>
              <span>Final Loss: <strong className="text-emerald-300">{fineTuneResult.final_loss}</strong></span>
              <span>PPL: <strong className="text-cyan-300">{fineTuneResult.perplexity}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* CRISP-DM 6 Phases Deep Dive */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-purple-400" />
              CRISP-DM 6-Phase Lifecycle Methodology
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click through each phase to inspect architecture blueprints, KPIs, and deliverables.
            </p>
          </div>

          {/* Phase Selector Tabs */}
          <div className="flex flex-wrap gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {crispTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCrispTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCrispTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Render Active CRISP-DM Phase Component */}
        <CurrentCrispComponent />
      </div>
    </div>
  );
};
