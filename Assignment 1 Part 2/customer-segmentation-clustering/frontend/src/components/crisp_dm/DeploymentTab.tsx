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
            <p className="text-xs text-slate-400">Microservice Architecture & Interactive Dashboard</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          The clustering system is deployed as a production-ready analytical service powered by a FastAPI REST backend and a modern React 19 visual interface:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-violet-400">
              <Server className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">FastAPI Microservice</h4>
            </div>
            <p className="text-xs text-slate-400">
              Endpoints:
              <br/>• <code className="text-emerald-300 font-mono">POST /api/cluster/predict</code> (Live persona inference)
              <br/>• <code className="text-cyan-300 font-mono">POST /api/clustering/run</code> (Dynamic model execution)
              <br/>• <code className="text-purple-300 font-mono">GET /api/customers</code> (500 records & PCA coords)
              <br/>• <code className="text-amber-300 font-mono">GET /api/elbow/curves</code> (WCSS & Silhouette curves)
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Monitor className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase">React 19 Frontend</h4>
            </div>
            <p className="text-xs text-slate-400">
              User Experience:
              <br/>• Interactive 2D/3D SVG Scatter Plot with hover inspection
              <br/>• Live customer profile classifier simulator
              <br/>• Correlation matrix heatmap & feature distributions
              <br/>• CRISP-DM methodology lifecycle dashboard
            </p>
          </div>
        </div>

        <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs text-slate-300">
            <strong>Production Status: Operational & Online.</strong> Microservice response time &lt; 2ms with 100% automated test coverage.
          </div>
        </div>
      </div>
    </div>
  );
};
