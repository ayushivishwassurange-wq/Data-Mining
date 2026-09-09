import React, { useEffect, useState } from 'react';
import { EDAInsights } from '../../types';
import { api } from '../../api/client';
import {
  Database,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  Layers,
} from 'lucide-react';

export const DataUnderstandingTab: React.FC = () => {
  const [eda, setEda] = useState<EDAInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getEdaInsights()
      .then((res) => {
        if (res.success) setEda(res.data);
      })
      .catch((err) => console.error('Failed to load EDA telemetry:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !eda) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 text-xs">
        Loading EDA telemetry data...
      </div>
    );
  }

  const maxHourlyCount = Math.max(...Object.values(eda.hourly_trip_counts), 1);
  const maxBinnedCount = Math.max(...eda.fare_binned_distribution.map((b) => b.count), 1);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Phase Header */}
      <div className="bg-gradient-to-r from-sky-500/15 via-slate-900 to-slate-900 border border-sky-500/30 rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-500/20 text-sky-400 rounded-2xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">CRISP-DM Phase 2</span>
            <h2 className="text-2xl font-extrabold text-white">Data Understanding & Exploratory Data Analysis</h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
          Exploration of the NYC Taxi trip records reveals strong spatial concentration in Midtown Manhattan, distinct morning/evening commuter demand peaks, and long right-tailed fare distributions driven by JFK/EWR airport rides.
        </p>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Dataset Samples</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {eda.total_records.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400">Verified NYC Bounding Box</span>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Mean / Median Fare</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">
            ${eda.mean_fare} <span className="text-sm text-slate-400 font-normal">/ ${eda.median_fare}</span>
          </div>
          <span className="text-[10px] text-slate-500">Std Dev: ${eda.std_fare}</span>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Mean Trip Distance</span>
          <div className="text-2xl font-extrabold text-sky-400 mt-1">
            {eda.mean_distance_miles} <span className="text-sm text-slate-400 font-normal">miles</span>
          </div>
          <span className="text-[10px] text-slate-500">Great-Circle Haversine</span>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Fare Range</span>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">
            ${eda.min_fare} - ${eda.max_fare}
          </div>
          <span className="text-[10px] text-slate-500">Outliers removed ($2.50-$350)</span>
        </div>
      </div>

      {/* 24-Hour Trip Volume & Average Fare Bar Charts */}
      <div className="bg-slate-900/50 p-5 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              24-Hour Demand Volume & Commute Surge Pattern
            </h3>
          </div>
          <span className="text-xs text-amber-400 font-mono">Peak: 16:00 - 20:00 (Evening Rush)</span>
        </div>

        <div className="h-44 flex items-end justify-between gap-1 pt-6 px-1">
          {Object.entries(eda.hourly_trip_counts).map(([hour, count]) => {
            const h = parseInt(hour, 10);
            const heightPct = Math.max((count / maxHourlyCount) * 100, 10);
            const avgFare = eda.hourly_avg_fare[hour] || 0;
            const isRush = h >= 16 && h <= 20;

            return (
              <div key={hour} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  ${avgFare}
                </span>
                <div className="w-full bg-slate-800/80 rounded-lg h-32 flex items-end p-0.5">
                  <div
                    className={`w-full rounded transition-all duration-300 ${
                      isRush
                        ? 'bg-gradient-to-t from-amber-500 to-yellow-300 shadow-sm shadow-amber-500/40'
                        : 'bg-gradient-to-t from-sky-600 to-sky-400'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-500">
                  {h % 4 === 0 ? `${h}h` : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fare Distribution Bins & Passenger Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Fare Distribution */}
        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Fare Amount Binned Distribution</span>
          </div>

          <div className="space-y-2.5 pt-2">
            {eda.fare_binned_distribution.map((bin) => {
              const pct = Math.round((bin.count / eda.total_records) * 100);
              return (
                <div key={bin.range} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{bin.range}</span>
                    <span className="font-mono text-slate-400">{bin.count.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Passenger Count Breakdown */}
        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Passenger Count Breakdown</span>
          </div>

          <div className="space-y-2.5 pt-2">
            {Object.entries(eda.passenger_distribution).map(([passengers, count]) => {
              const pct = Math.round((count / eda.total_records) * 100);
              return (
                <div key={passengers} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{passengers} Passenger{passengers === '1' ? '' : 's'}</span>
                    <span className="font-mono text-slate-400">{count.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
