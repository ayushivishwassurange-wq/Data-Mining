import React, { useState } from 'react';
import { PredictionResult } from '../../types';
import {
  DollarSign,
  Users,
  Clock,
  Calendar,
  Receipt,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface FareEstimatorCardProps {
  prediction: PredictionResult | null;
  isLoading: boolean;
  passengerCount: number;
  onPassengerCountChange: (count: number) => void;
  pickupDatetime: string;
  onPickupDatetimeChange: (dt: string) => void;
}

export const FareEstimatorCard: React.FC<FareEstimatorCardProps> = ({
  prediction,
  isLoading,
  passengerCount,
  onPassengerCountChange,
  pickupDatetime,
  onPickupDatetimeChange,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [selectedTipPct, setSelectedTipPct] = useState<number>(20);

  const breakdown = prediction?.breakdown;
  const tipAmount = prediction ? (prediction.predicted_fare * (selectedTipPct / 100)) : 0;
  const totalWithTip = prediction ? (prediction.predicted_fare + tipAmount) : 0;

  return (
    <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-5 shadow-2xl space-y-5 flex flex-col justify-between">
      {/* Top Fare Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/30 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <DollarSign className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Predicted NYC Taxi Fare
              </span>
              <p className="text-[11px] text-slate-400">
                {prediction?.model_name || 'XGBoost ML Model'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 font-mono">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{prediction ? `${prediction.inference_time_ms.toFixed(1)}ms` : '0.0ms'}</span>
          </div>
        </div>

        {/* Hero Fare Numbers */}
        <div className="mt-4 flex items-baseline gap-2">
          {isLoading ? (
            <div className="h-12 flex items-center gap-2 text-slate-500 text-lg animate-pulse">
              <span>Calculating dynamic fare...</span>
            </div>
          ) : (
            <>
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                ${prediction?.predicted_fare.toFixed(2) || '0.00'}
              </span>
              <span className="text-sm font-semibold text-amber-300/80">USD</span>
            </>
          )}
        </div>

        {/* Distance & Time Tag */}
        {prediction && (
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-300 font-medium">
            <span>⏱️ ~{prediction.estimated_duration_minutes} mins</span>
            <span>•</span>
            <span>🛣️ {prediction.distance_miles} mi ({prediction.manhattan_distance_miles} mi grid)</span>
          </div>
        )}
      </div>

      {/* Scenario Controls (Passengers & Time) */}
      <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Trip Settings & Conditions
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Passenger count selector */}
          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">
              Passengers
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onPassengerCountChange(num)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    passengerCount === num
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Pickup Datetime */}
          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={pickupDatetime}
              onChange={(e) => onPickupDatetimeChange(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Itemized Fare Receipt Breakdown */}
      {breakdown && (
        <div className="space-y-2 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/60 text-xs">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Receipt className="w-3.5 h-3.5 text-amber-400" />
              <span>Official TLC Pricing Breakdown</span>
            </div>
            {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showBreakdown && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800/60 divide-y divide-slate-800/40">
              <div className="flex justify-between text-slate-400 pt-1">
                <span>Standard Base Flag Drop:</span>
                <span className="font-mono text-slate-200">${breakdown.base_charge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1">
                <span>Distance Rate Charge:</span>
                <span className="font-mono text-slate-200">${breakdown.distance_charge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1">
                <span>NY Congestion Surcharge:</span>
                <span className="font-mono text-slate-200">${breakdown.congestion_fee.toFixed(2)}</span>
              </div>
              {breakdown.rush_hour_surcharge > 0 && (
                <div className="flex justify-between text-amber-400 pt-1 font-semibold">
                  <span>⚡ Peak Commute Rush Hour (4-8pm):</span>
                  <span className="font-mono">+${breakdown.rush_hour_surcharge.toFixed(2)}</span>
                </div>
              )}
              {breakdown.overnight_surcharge > 0 && (
                <div className="flex justify-between text-sky-400 pt-1">
                  <span>🌙 Overnight Surcharge (8pm-6am):</span>
                  <span className="font-mono">+${breakdown.overnight_surcharge.toFixed(2)}</span>
                </div>
              )}
              {breakdown.airport_flat_or_toll > 0 && (
                <div className="flex justify-between text-rose-400 pt-1 font-bold">
                  <span>✈️ JFK Airport Flat Surcharge / Toll:</span>
                  <span className="font-mono">+${breakdown.airport_flat_or_toll.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-700">
                <span>Total Calculated Fare:</span>
                <span className="font-mono text-amber-300 text-sm">${breakdown.total_fare.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tip Suggestions */}
      {prediction && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Add Suggested Driver Tip:</span>
            <span className="text-slate-200 font-mono">
              Total with Tip: <strong className="text-emerald-400">${totalWithTip.toFixed(2)}</strong>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[15, 20, 25].map((pct) => {
              const tipVal = prediction.predicted_fare * (pct / 100);
              const isSel = selectedTipPct === pct;
              return (
                <button
                  key={pct}
                  onClick={() => setSelectedTipPct(pct)}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    isSel
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold">{pct}%</div>
                  <div className="text-[10px] font-mono mt-0.5">${tipVal.toFixed(2)}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Model Explainability / Top Factors */}
      {prediction?.top_contributions && prediction.top_contributions.length > 0 && (
        <div className="space-y-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>Top ML Prediction Factors:</span>
          </div>
          <div className="space-y-1">
            {prediction.top_contributions.slice(0, 3).map((c) => (
              <div key={c.feature} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 truncate max-w-[200px]">{c.impact_description}</span>
                <span className="font-mono text-indigo-400">#{c.importance_rank}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
