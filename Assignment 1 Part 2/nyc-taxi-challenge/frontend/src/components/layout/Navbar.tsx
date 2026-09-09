import React from 'react';
import { CRISPPhase } from '../../types';
import {
  Car,
  Briefcase,
  Database,
  Wrench,
  Cpu,
  BarChart3,
  Server,
  Zap,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from 'lucide-react';

interface NavbarProps {
  activePhase: CRISPPhase;
  setActivePhase: (phase: CRISPPhase) => void;
  backendOnline: boolean;
  onApplyPreset: (pickup: [number, number], dropoff: [number, number], name: string) => void;
}

export const PRESETS = [
  { name: 'Times Sq ➔ JFK Airport', pickup: [40.7580, -73.9855] as [number, number], dropoff: [40.6413, -73.7781] as [number, number] },
  { name: 'Wall St ➔ LaGuardia (LGA)', pickup: [40.7070, -74.0090] as [number, number], dropoff: [40.7769, -73.8740] as [number, number] },
  { name: 'Central Park ➔ DUMBO Brooklyn', pickup: [40.7660, -73.9765] as [number, number], dropoff: [40.7020, -73.9930] as [number, number] },
  { name: 'Midtown ➔ Newark (EWR)', pickup: [40.7527, -73.9772] as [number, number], dropoff: [40.6895, -74.1745] as [number, number] },
];

export const Navbar: React.FC<NavbarProps> = ({
  activePhase,
  setActivePhase,
  backendOnline,
  onApplyPreset,
}) => {
  const phases: { id: CRISPPhase; label: string; icon: any; step: string }[] = [
    { id: 'business', label: '1. Business', icon: Briefcase, step: 'P1' },
    { id: 'data_understanding', label: '2. Data EDA', icon: Database, step: 'P2' },
    { id: 'data_prep', label: '3. Data Prep', icon: Wrench, step: 'P3' },
    { id: 'modeling', label: '4. Modeling', icon: Cpu, step: 'P4' },
    { id: 'evaluation', label: '5. Evaluation', icon: BarChart3, step: 'P5' },
    { id: 'deployment', label: '6. Live API', icon: Server, step: 'P6' },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Live Health */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/25 ring-1 ring-white/20">
              <Car className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  NYC Taxi Challenge
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded uppercase tracking-wider">
                  CRISP-DM
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Kaggle Fare Prediction & Real-Time ML Engine
              </p>
            </div>
          </div>

          {/* Backend Status Pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              backendOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span>{backendOnline ? 'FastAPI & ML Live' : 'Connecting API...'}</span>
          </div>
        </div>

        {/* CRISP-DM Phase Switcher Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
          {phases.map((p) => {
            const Icon = p.icon;
            const isActive = activePhase === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePhase(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Route Presets Dropdown */}
        <div className="hidden lg:flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Presets:</span>
          <div className="flex gap-1">
            {PRESETS.slice(0, 2).map((pr) => (
              <button
                key={pr.name}
                onClick={() => onApplyPreset(pr.pickup, pr.dropoff, pr.name)}
                className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 rounded-lg text-[11px] font-medium transition-colors truncate max-w-[150px]"
                title={`Load route: ${pr.name}`}
              >
                {pr.name.split(' ➔ ')[0]} ➔ {pr.name.split(' ➔ ')[1]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
