import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Award, 
  TrendingDown, 
  Gauge, 
  Activity, 
  Sparkles, 
  Target, 
  Users, 
  RefreshCw,
  Cpu
} from 'lucide-react';
import { api } from '../api/client';
import { ElbowCurveData, ClusterPersona } from '../types';
import { BusinessTab } from './crisp_dm/BusinessTab';
import { DataUnderstandingTab } from './crisp_dm/DataUnderstandingTab';
import { DataPrepTab } from './crisp_dm/DataPrepTab';
import { ModelingTab } from './crisp_dm/ModelingTab';
import { EvaluationTab } from './crisp_dm/EvaluationTab';
import { DeploymentTab } from './crisp_dm/DeploymentTab';

export const AdminDashboard: React.FC = () => {
  const [elbowData, setElbowData] = useState<ElbowCurveData | null>(null);
  const [personas, setPersonas] = useState<ClusterPersona[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCrispTab, setActiveCrispTab] = useState(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [elbow, pers] = await Promise.all([
        api.getElbowCurves(),
        api.getPersonas()
      ]);
      setElbowData(elbow);
      setPersonas(pers.personas);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      {/* Header */}
      <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                CRISP-DM Clustering Admin & Governance Dashboard
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Model performance monitoring, elbow method inertia validation, mathematical silhouette distributions, and full CRISP-DM lifecycle tracking.
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 shadow transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Analytics</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Silhouette Score</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">0.3924</div>
          <p className="text-[11px] text-slate-500 mt-1">Inter-cluster separation</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Davies-Bouldin</span>
            <TrendingDown className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400">1.0837</div>
          <p className="text-[11px] text-slate-500 mt-1">Intra-cluster cohesion</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Calinski-Harabasz</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400">360.47</div>
          <p className="text-[11px] text-slate-500 mt-1">Variance Ratio Index</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Optimal Clusters</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">k = 5</div>
          <p className="text-[11px] text-slate-500 mt-1">Elbow point inflection</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">PCA Variance</span>
            <Sparkles className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-teal-400">79.7%</div>
          <p className="text-[11px] text-slate-500 mt-1">2D Explained Information</p>
        </div>
      </div>

      {/* SVG Elbow & Silhouette Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Elbow Inertia Curve */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              Elbow Method WCSS Inertia Curve (k=2..10)
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              Inflection at k=5
            </span>
          </div>

          <div className="h-56 bg-slate-950 rounded-xl border border-slate-800 p-4 relative flex items-end">
            {elbowData ? (
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
                {/* Horizontal Grid */}
                <line x1="0" y1="0" x2="500" y2="0" stroke="#1e293b" strokeDasharray="3" />
                <line x1="0" y1="45" x2="500" y2="45" stroke="#1e293b" strokeDasharray="3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#1e293b" strokeDasharray="3" />
                <line x1="0" y1="135" x2="500" y2="135" stroke="#1e293b" strokeDasharray="3" />
                <line x1="0" y1="180" x2="500" y2="180" stroke="#334155" />

                {/* Inertia Path */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  points={elbowData.inertias.map((val, idx) => {
                    const x = (idx / (elbowData.inertias.length - 1)) * 500;
                    const maxVal = 1800;
                    const minVal = 400;
                    const y = 180 - ((val - minVal) / (maxVal - minVal)) * 160 - 10;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                {/* Point Circles & Labels */}
                {elbowData.inertias.map((val, idx) => {
                  const x = (idx / (elbowData.inertias.length - 1)) * 500;
                  const maxVal = 1800;
                  const minVal = 400;
                  const y = 180 - ((val - minVal) / (maxVal - minVal)) * 160 - 10;
                  const isOptimal = idx === 3; // k=5

                  return (
                    <g key={idx}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isOptimal ? 6 : 4}
                        fill={isOptimal ? '#34d399' : '#10b981'}
                        stroke="#0f172a"
                        strokeWidth="2"
                      />
                      {isOptimal && (
                        <text x={x} y={y - 12} fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          Optimal (k=5)
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            ) : (
              <div className="flex items-center justify-center w-full text-xs text-slate-500">
                Loading inertia curve...
              </div>
            )}
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>k = 2 (Inertia: 1648)</span>
            <span>k = 5 (Inertia: 735)</span>
            <span>k = 10 (Inertia: 480)</span>
          </div>
        </div>

        {/* Silhouette Score Curve */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              Silhouette Score Across Cluster Counts (k=2..10)
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              Peak Quality
            </span>
          </div>

          <div className="h-56 bg-slate-950 rounded-xl border border-slate-800 p-4 relative flex items-end">
            {elbowData ? (
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
                {/* Horizontal Grid */}
                <line x1="0" y1="0" x2="500" y2="0" stroke="#1e293b" strokeDasharray="3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#1e293b" strokeDasharray="3" />
                <line x1="0" y1="180" x2="500" y2="180" stroke="#334155" />

                {/* Silhouette Path */}
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  points={elbowData.silhouettes.map((val, idx) => {
                    const x = (idx / (elbowData.silhouettes.length - 1)) * 500;
                    const maxVal = 0.45;
                    const minVal = 0.25;
                    const y = 180 - ((val - minVal) / (maxVal - minVal)) * 160 - 10;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                {/* Circles */}
                {elbowData.silhouettes.map((val, idx) => {
                  const x = (idx / (elbowData.silhouettes.length - 1)) * 500;
                  const maxVal = 0.45;
                  const minVal = 0.25;
                  const y = 180 - ((val - minVal) / (maxVal - minVal)) * 160 - 10;
                  const isOptimal = idx === 3; // k=5

                  return (
                    <g key={idx}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isOptimal ? 6 : 4}
                        fill={isOptimal ? '#7dd3fc' : '#38bdf8'}
                        stroke="#0f172a"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
              </svg>
            ) : (
              <div className="flex items-center justify-center w-full text-xs text-slate-500">
                Loading silhouette curve...
              </div>
            )}
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>k = 2 (Sil: 0.29)</span>
            <span>k = 5 (Sil: 0.392)</span>
            <span>k = 10 (Sil: 0.31)</span>
          </div>
        </div>
      </div>

      {/* Customer Persona Blueprint Cards */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" />
          Customer Persona Taxonomy & Marketing Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personas.map((p) => (
            <div
              key={p.cluster_id}
              style={{ borderColor: `${p.color}50` }}
              className="bg-slate-950 rounded-2xl p-5 border space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                <div>
                  <h4 className="font-bold text-sm" style={{ color: p.color }}>
                    {p.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {p.tag}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300">
                  {p.customer_count} ({p.percentage}%)
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {p.description}
              </p>

              <div className="p-3 bg-slate-900/80 rounded-xl text-xs space-y-1.5 border border-slate-800">
                <span className="font-semibold text-emerald-300 block text-[11px] uppercase tracking-wider">
                  Targeted Marketing Strategy:
                </span>
                <p className="text-slate-300 text-[11px] leading-snug">
                  {p.actionable_strategy}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>ROI: <strong className="text-emerald-400">{p.campaign_roi_potential}</strong></span>
                <span>Churn: <strong className={p.churn_risk === 'Low' ? 'text-emerald-400' : 'text-amber-400'}>{p.churn_risk}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CRISP-DM 6-Phase Deep Dive */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-emerald-400" />
              CRISP-DM 6-Phase Lifecycle Methodology
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured machine learning methodology deliverables, milestones, and governance artifacts.
            </p>
          </div>

          <div className="flex flex-wrap gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {crispTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCrispTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCrispTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <CurrentCrispComponent />
      </div>
    </div>
  );
};
