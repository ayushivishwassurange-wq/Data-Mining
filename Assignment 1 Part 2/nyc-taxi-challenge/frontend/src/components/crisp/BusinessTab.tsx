import React from 'react';
import {
  Briefcase,
  Target,
  TrendingUp,
  DollarSign,
  Scale,
  Award,
  AlertCircle,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const BusinessTab: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">CRISP-DM Phase 1</span>
            <h2 className="text-2xl font-extrabold text-white">Business Understanding & Problem Formulation</h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
          The New York City Taxi and Limousine Commission (TLC) regulates over 13,000 yellow medallion taxis operating across 5 boroughs. Accurate upfront taxi fare estimation is vital for rider price transparency, fleet routing optimization, surge mitigation, and competition with ride-hailing platforms (Uber, Lyft).
        </p>
      </div>

      {/* 3 Core Business Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Objective 1 */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-3">
          <div className="p-2.5 w-fit rounded-xl bg-indigo-500/15 text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Upfront Price Transparency</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Eliminate rider bill shock by delivering instantaneous, hyper-accurate fare estimates prior to boarding using pickup/dropoff coordinates and real-time temporal parameters.
          </p>
        </div>

        {/* Objective 2 */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-3">
          <div className="p-2.5 w-fit rounded-xl bg-amber-500/15 text-amber-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Dynamic Pricing & TLC Rules</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Incorporate statutory TLC rules: $3.00 base drop, $2.50 NY congestion fee, $1.50 peak commute surge (4–8 PM), $0.75 overnight fee, and JFK Airport flat pricing ($70).
          </p>
        </div>

        {/* Objective 3 */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-3">
          <div className="p-2.5 w-fit rounded-xl bg-emerald-500/15 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Fleet Dispatch Optimization</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Empower dispatch algorithms and drivers with expected revenue yield per trip distance and traffic bearing, reducing idle deadhead miles.
          </p>
        </div>
      </div>

      {/* Mathematical Formulation & Success Criteria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span>Kaggle Challenge Evaluation Metric</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The competition is formally evaluated on <strong>Root Mean Squared Error (RMSE)</strong>:
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 text-center">
            {'RMSE = sqrt( (1/N) * sum_{i=1}^N (y_i - y_hat_i)^2 )'}
          </div>
          <p className="text-[11px] text-slate-500">
            Penalizes large errors heavily, ensuring predictions remain closely bound even on high-fare airport or suburban transit journeys.
          </p>
        </div>

        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Success Criteria & Target Benchmarks</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>RMSE Goal:</strong> &lt; $2.00 on unseen NYC test sets</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>Inference Latency:</strong> &lt; 20ms per prediction for high-throughput dispatch</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>Explainability:</strong> Full itemized receipt decomposing distance vs tolls vs rush hours</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
