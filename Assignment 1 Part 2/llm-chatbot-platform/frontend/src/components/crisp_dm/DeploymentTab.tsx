import React from 'react';
import { Rocket, Server, Radio, Monitor, CheckCircle2 } from 'lucide-react';

export const DeploymentTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-violet-500/20 text-violet-400">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Phase 6: Deployment & Monitoring</h3>
            <p className="text-xs text-slate-400">FastAPI SSE Streaming & Real-Time Telemetry Monitor</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          The Mini-LLM system is deployed as an asynchronous microservice using FastAPI Server-Sent Events (SSE) coupled with a React 19 single-page UI:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-violet-400">
              <Server className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">FastAPI Backend</h4>
            </div>
            <p className="text-xs text-slate-400">
              Endpoints:
              <br/>• <code className="text-purple-300 font-mono">POST /api/chat/stream</code> (SSE token delta)
              <br/>• <code className="text-cyan-300 font-mono">POST /api/attention/inspect</code> (Attention matrices)
              <br/>• <code className="text-emerald-300 font-mono">POST /api/tokenizer/tokenize</code> (Token segments)
              <br/>• <code className="text-amber-300 font-mono">POST /api/training/finetune</code> (Live gradient step)
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Monitor className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">React 19 Frontend</h4>
            </div>
            <p className="text-xs text-slate-400">
              Architecture:
              <br/>• ChatGPT-style streaming chat with typewriter cursor
              <br/>• 2D multi-layer attention heatmaps
              <br/>• Color-coded subword segmenter sandbox
              <br/>• Interactive CRISP-DM live admin panel
            </p>
          </div>
        </div>

        <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs text-slate-300">
            <strong>Production Status: Healthy & Online.</strong> Zero external network dependencies. Runs locally on CPU/GPU with full hardware acceleration.
          </div>
        </div>
      </div>
    </div>
  );
};
