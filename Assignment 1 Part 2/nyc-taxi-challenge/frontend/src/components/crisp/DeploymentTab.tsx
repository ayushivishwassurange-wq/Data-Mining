import React, { useState } from 'react';
import {
  Server,
  Code2,
  Terminal,
  CheckCircle2,
  ExternalLink,
  Copy,
  Zap,
} from 'lucide-react';

export const DeploymentTab: React.FC = () => {
  const [copiedCurl, setCopiedCurl] = useState(false);

  const curlExample = `curl -X POST "http://localhost:8000/api/predict" \\
     -H "Content-Type: application/json" \\
     -d '{
       "pickup_longitude": -73.9855,
       "pickup_latitude": 40.7580,
       "dropoff_longitude": -73.7781,
       "dropoff_latitude": 40.6413,
       "passenger_count": 2,
       "pickup_datetime": "2025-06-15 17:30:00"
     }'`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(curlExample);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/api/predict',
      desc: 'Real-time single trip fare prediction with complete itemized receipt and top feature contributions.',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      method: 'POST',
      path: '/api/predict/batch',
      desc: 'Bulk JSON array prediction returning individual fares and summary metrics (total revenue, average fare).',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      method: 'POST',
      path: '/api/predict/upload-csv',
      desc: 'Upload CSV containing pickup/dropoff coordinates to receive real-time streaming batch predictions.',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      method: 'GET',
      path: '/api/models/benchmark',
      desc: 'Returns comparative evaluation metrics (RMSE, MAE, R², latency) across all 4 machine learning models.',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      method: 'GET',
      path: '/api/eda/insights',
      desc: 'Returns telemetry summary of dataset distributions, hourly volume, and passenger breakdowns.',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      method: 'GET',
      path: '/api/health',
      desc: 'Production liveness probe, model version, and uptime telemetry.',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Phase Header */}
      <div className="bg-gradient-to-r from-indigo-500/15 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">CRISP-DM Phase 6</span>
              <h2 className="text-2xl font-extrabold text-white">Production Deployment & FastAPI REST Architecture</h2>
            </div>
          </div>

          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <span>Interactive Swagger UI</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
          The champion XGBoost model is packaged with Scikit-Learn transformers and served via an asynchronous, production-hardened FastAPI server capable of handling sub-2ms inferences and streaming bulk batch uploads.
        </p>
      </div>

      {/* Production Endpoints Table */}
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl space-y-2">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Available REST API Endpoints
          </h3>
        </div>

        <div className="divide-y divide-slate-800/60">
          {endpoints.map((ep) => (
            <div key={ep.path} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${ep.badge}`}>
                  {ep.method}
                </span>
                <span className="font-mono text-xs font-semibold text-slate-200">{ep.path}</span>
              </div>
              <p className="text-xs text-slate-400 max-w-xl">{ep.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* cURL Integration Snippet */}
      <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Quick cURL Request Snippet
            </h3>
          </div>

          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            {copiedCurl ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy cURL</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-amber-300 overflow-x-auto">
          {curlExample}
        </pre>
      </div>
    </div>
  );
};
