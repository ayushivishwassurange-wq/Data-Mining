import React from 'react';
import {
  Wrench,
  Navigation,
  Compass,
  Plane,
  Clock,
  Code2,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const DataPrepTab: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Phase Header */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">CRISP-DM Phase 3</span>
            <h2 className="text-2xl font-extrabold text-white">Data Preparation & Spatial Feature Engineering</h2>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
          Raw coordinates and timestamps are transformed into 29 high-signal predictive features capturing spherical great-circle distances, Manhattan grid taxicab metrics, compass bearings, airport zone surcharges, and continuous cyclical temporal dynamics.
        </p>
      </div>

      {/* Feature Engineering Deep-Dives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Haversine vs Manhattan */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>Haversine vs. Manhattan Distance</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            While Haversine computes great-circle direct flight distance, Manhattan distance accounts for NYC's rigid street grid (L1 norm):
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs font-mono">
            <div className="text-emerald-300">d_manhattan = 69.0 * |delta_lat| + 52.0 * |delta_lon|</div>
            <div className="text-sky-300">d_haversine = 2R * arcsin( sqrt( sin^2(d_lat/2) + cos(lat1)*cos(lat2)*sin^2(d_lon/2) ) )</div>
          </div>
          <p className="text-[11px] text-slate-500">
            Both metrics combined provide tree models with strong linear & non-linear spatial proxies.
          </p>
        </div>

        {/* Airport Proximities */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <Plane className="w-4 h-4 text-amber-400" />
            <span>Tri-State Airport Radius Detection</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Detects airport trips based on geodesic proximity thresholds to capture flat fares & bridge/tunnel tolls:
          </p>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-semibold">✈️ JFK International:</span>
              <span className="font-mono text-amber-400">(-73.7781, 40.6413) &lt; 2.0 mi</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-semibold">✈️ LaGuardia (LGA):</span>
              <span className="font-mono text-sky-400">(-73.8740, 40.7769) &lt; 1.8 mi</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-semibold">✈️ Newark Liberty (EWR):</span>
              <span className="font-mono text-purple-400">(-74.1745, 40.6895) &lt; 2.0 mi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compass Bearing & Cyclical Encodings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Bearing Angle */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Compass Bearing / Direction of Travel</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Calculates forward azimuth angle (0° to 360°) to distinguish uptown vs downtown vs cross-borough bridge trips:
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-indigo-300">
            theta = atan2( sin(d_lon)*cos(lat2), cos(lat1)*sin(lat2) - sin(lat1)*cos(lat2)*cos(d_lon) )
          </div>
          <p className="text-[11px] text-slate-500">
            Decomposed into sin(theta) and cos(theta) continuous cyclical features.
          </p>
        </div>

        {/* Cyclical Time Encodings */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <Clock className="w-4 h-4 text-rose-400" />
            <span>Trigonometric Cyclical Time Encodings</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Prevents artificial discontinuities where hour 23:59 wraps to 00:00 or December wraps to January:
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs font-mono text-rose-300">
            <div>sin(hour) = sin(2*pi * hour / 24),  cos(hour) = cos(2*pi * hour / 24)</div>
            <div>sin(month) = sin(2*pi * month / 12),  cos(month) = cos(2*pi * month / 12)</div>
          </div>
          <p className="text-[11px] text-slate-500">
            Ensures continuous cyclical representation of diurnal and annual seasonality.
          </p>
        </div>
      </div>
    </div>
  );
};
