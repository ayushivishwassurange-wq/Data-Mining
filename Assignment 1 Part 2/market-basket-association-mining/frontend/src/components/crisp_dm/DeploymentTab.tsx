import React from 'react';
import { Rocket, Cpu, RefreshCw, BarChart2, CheckCircle2, ShieldAlert } from 'lucide-react';

export const DeploymentTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Phase 6: Deployment & Actionable Operations</h3>
            <p className="text-xs text-slate-400">Real-Time In-Memory Inference, Microservice Architecture & POS Strategy</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          The pattern engine is operationalized as a sub-5ms FastAPI microservice integrated with modern React shopping cart interfaces and physical retail planograms:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-teal-400">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Cart Recommender</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              FastAPI endpoint evaluating the user's active cart against indexed antecedent rules with &lt; 5ms SLA latency.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <BarChart2 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Planogram Placement</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Supermarket aisle redesign placing top Lift product pairs (e.g. Pasta + Tomato Sauce) in adjacent bays.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400">
              <RefreshCw className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Nightly Cron Mining</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated ECLAT pipeline re-mining transactional delta logs every 24 hours to capture seasonal shifts.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Drift Detection</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated monitoring for rule degradation (Lift &lt; 1.0) with alerting triggers for merchandise re-indexing.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <strong>REST API Production Endpoints:</strong> All rules, graph topologies, itemset hierarchies, and dynamic basket recommendations are accessible via high-throughput JSON endpoints documented with OpenAPI / Swagger specifications.
          </div>
        </div>
      </div>
    </div>
  );
};
