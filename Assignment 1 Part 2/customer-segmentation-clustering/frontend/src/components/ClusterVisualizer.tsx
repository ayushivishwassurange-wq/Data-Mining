import React, { useState, useEffect } from 'react';
import { 
  ScatterChart, 
  Layers, 
  Sliders, 
  RefreshCw, 
  Cpu, 
  Info, 
  Zap, 
  Award, 
  Target, 
  TrendingUp,
  Sparkles,
  Search
} from 'lucide-react';
import { api } from '../api/client';
import { CustomerRecord, ClusterRunResult, ClusterPersona } from '../types';

const CLUSTER_COLORS = [
  '#a855f7', // Purple - VIP
  '#38bdf8', // Cyan - Frugal
  '#fbbf24', // Amber - Trendsetters
  '#94a3b8', // Slate - Budget
  '#10b981', // Emerald - Balanced
  '#ec4899', // Pink
  '#f97316', // Orange
  '#6366f1', // Indigo
];

const NOISE_COLOR = '#f43f5e'; // Rose

export const ClusterVisualizer: React.FC<{ onAlgoChange: (algo: string) => void }> = ({ onAlgoChange }) => {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [pcaVariance, setPcaVariance] = useState<number[]>([0.576, 0.221]);
  const [algorithm, setAlgorithm] = useState<'kmeans' | 'dbscan' | 'hierarchical' | 'gmm'>('kmeans');
  const [axisMode, setAxisMode] = useState<'pca' | 'features'>('pca');
  const [loading, setLoading] = useState(false);
  const [clusterResult, setClusterResult] = useState<ClusterRunResult | null>(null);

  // Hyperparameters
  const [nClusters, setNClusters] = useState(5);
  const [eps, setEps] = useState(0.65);
  const [minSamples, setMinSamples] = useState(5);
  const [linkage, setLinkage] = useState('ward');
  const [covType, setCovType] = useState('full');

  // Hover state
  const [hoveredCustomer, setHoveredCustomer] = useState<CustomerRecord | null>(null);
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<number | 'all'>('all');

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const data = await api.getCustomers();
      setCustomers(data.customers);
      setPcaVariance(data.pca_variance);
      runClusteringModel(algorithm, nClusters, eps, minSamples, linkage, covType);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const runClusteringModel = async (
    algo: string,
    k: number,
    e: number,
    ms: number,
    link: string,
    cov: string
  ) => {
    try {
      setLoading(true);
      onAlgoChange(algo.toUpperCase());
      const res = await api.runClustering({
        algorithm: algo,
        n_clusters: k,
        eps: e,
        min_samples: ms,
        linkage: link,
        covariance_type: cov,
      });
      setClusterResult(res);
    } catch (err) {
      console.error('Clustering run failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleAlgorithmChange = (newAlgo: 'kmeans' | 'dbscan' | 'hierarchical' | 'gmm') => {
    setAlgorithm(newAlgo);
    runClusteringModel(newAlgo, nClusters, eps, minSamples, linkage, covType);
  };

  // Get active cluster label for a customer
  const getCustomerCluster = (c: CustomerRecord, idx: number): number => {
    if (clusterResult && clusterResult.labels && clusterResult.labels[idx] !== undefined) {
      return clusterResult.labels[idx];
    }
    if (algorithm === 'kmeans') return c.kmeans_cluster;
    if (algorithm === 'dbscan') return c.dbscan_cluster;
    if (algorithm === 'hierarchical') return c.hierarchical_cluster;
    if (algorithm === 'gmm') return c.gmm_cluster;
    return c.kmeans_cluster;
  };

  const getPointColor = (clusterId: number): string => {
    if (clusterId === -1) return NOISE_COLOR;
    return CLUSTER_COLORS[clusterId % CLUSTER_COLORS.length];
  };

  // Coordinates mapping for SVG viewBox (0,0 to 600,450)
  const getSvgCoordinates = (c: CustomerRecord) => {
    if (axisMode === 'pca') {
      // PCA ranges approximately from -3.5 to +3.5
      const minX = -3.8, maxX = 3.8;
      const minY = -3.2, maxY = 3.2;
      const svgX = ((c.pca_x - minX) / (maxX - minX)) * 560 + 20;
      const svgY = 430 - ((c.pca_y - minY) / (maxY - minY)) * 390 - 20;
      return { x: svgX, y: svgY };
    } else {
      // Feature space: Income (15 to 140) vs Spending (1 to 100)
      const svgX = ((c.annual_income - 10) / (145 - 10)) * 560 + 20;
      const svgY = 430 - ((c.spending_score - 0) / (105 - 0)) * 390 - 20;
      return { x: svgX, y: svgY };
    }
  };

  const filteredCustomers = selectedClusterFilter === 'all'
    ? customers
    : customers.filter((c, idx) => getCustomerCluster(c, idx) === selectedClusterFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <ScatterChart className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                Multi-Algorithm Customer Cluster Explorer
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Compare <strong>K-Means</strong>, <strong>DBSCAN</strong>, <strong>Agglomerative Hierarchical</strong>, and <strong>GMM</strong> partitions in real-time. 
              Projected via 2D PCA preserving <strong className="text-emerald-400">{(pcaVariance.reduce((a,b)=>a+b,0)*100).toFixed(1)}%</strong> of 6-dimensional customer variance.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>500 Real-Time Points</span>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Algorithm Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-500 px-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Model:
            </span>
            <button
              onClick={() => handleAlgorithmChange('kmeans')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                algorithm === 'kmeans' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              K-Means++
            </button>
            <button
              onClick={() => handleAlgorithmChange('dbscan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                algorithm === 'dbscan' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              DBSCAN (Density)
            </button>
            <button
              onClick={() => handleAlgorithmChange('hierarchical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                algorithm === 'hierarchical' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hierarchical Tree
            </button>
            <button
              onClick={() => handleAlgorithmChange('gmm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                algorithm === 'gmm' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              GMM (Probabilistic)
            </button>
          </div>

          {/* Projection Axis Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 px-2 font-semibold">View Space:</span>
            <button
              onClick={() => setAxisMode('pca')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                axisMode === 'pca' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2D PCA (All 6 Features)
            </button>
            <button
              onClick={() => setAxisMode('features')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                axisMode === 'features' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Income vs Spending Score
            </button>
          </div>
        </div>

        {/* Hyperparameter Sliders Bar */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-6 text-xs">
          {algorithm === 'kmeans' && (
            <div className="flex items-center gap-4 flex-1">
              <span className="text-slate-400 font-mono">Clusters (k): <strong className="text-emerald-400">{nClusters}</strong></span>
              <input
                type="range"
                min="2"
                max="10"
                value={nClusters}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setNClusters(val);
                  runClusteringModel('kmeans', val, eps, minSamples, linkage, covType);
                }}
                className="flex-1 accent-emerald-500 max-w-xs"
              />
              <span className="text-[11px] text-slate-500">Optimal k=5 via Elbow Inflection</span>
            </div>
          )}

          {algorithm === 'dbscan' && (
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-mono">Epsilon (ε): <strong className="text-emerald-400">{eps}</strong></span>
                <input
                  type="range"
                  min="0.3"
                  max="1.2"
                  step="0.05"
                  value={eps}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setEps(val);
                    runClusteringModel('dbscan', nClusters, val, minSamples, linkage, covType);
                  }}
                  className="w-32 accent-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-mono">Min Samples: <strong className="text-emerald-400">{minSamples}</strong></span>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={minSamples}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setMinSamples(val);
                    runClusteringModel('dbscan', nClusters, eps, val, linkage, covType);
                  }}
                  className="w-32 accent-emerald-500"
                />
              </div>
            </div>
          )}

          {algorithm === 'hierarchical' && (
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-mono">Clusters (k): <strong className="text-emerald-400">{nClusters}</strong></span>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={nClusters}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setNClusters(val);
                    runClusteringModel('hierarchical', val, eps, minSamples, linkage, covType);
                  }}
                  className="w-32 accent-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Linkage:</span>
                <select
                  value={linkage}
                  onChange={(e) => {
                    setLinkage(e.target.value);
                    runClusteringModel('hierarchical', nClusters, eps, minSamples, e.target.value, covType);
                  }}
                  className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1"
                >
                  <option value="ward">Ward (Variance Min)</option>
                  <option value="complete">Complete Linkage</option>
                  <option value="average">Average Linkage</option>
                </select>
              </div>
            </div>
          )}

          {algorithm === 'gmm' && (
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-mono">Components: <strong className="text-emerald-400">{nClusters}</strong></span>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={nClusters}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setNClusters(val);
                    runClusteringModel('gmm', val, eps, minSamples, linkage, covType);
                  }}
                  className="w-32 accent-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Covariance:</span>
                <select
                  value={covType}
                  onChange={(e) => {
                    setCovType(e.target.value);
                    runClusteringModel('gmm', nClusters, eps, minSamples, linkage, e.target.value);
                  }}
                  className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1"
                >
                  <option value="full">Full (Elliptical)</option>
                  <option value="tied">Tied Matrix</option>
                  <option value="diag">Diagonal</option>
                  <option value="spherical">Spherical</option>
                </select>
              </div>
            </div>
          )}

          {/* Active Metrics Badges */}
          {clusterResult && (
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Silhouette: <strong className="text-emerald-400">{clusterResult.metrics.silhouette_score}</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Davies-Bouldin: <strong className="text-cyan-400">{clusterResult.metrics.davies_bouldin_index}</strong>
              </span>
              {clusterResult.metrics.noise_points !== undefined && (
                <span className="px-2.5 py-1 rounded bg-rose-950/40 border border-rose-500/40 text-rose-300">
                  Noise: <strong>{clusterResult.metrics.noise_points} pts</strong> ({clusterResult.metrics.noise_percentage}%)
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Canvas & Persona Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: SVG Interactive Scatter Canvas */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 font-mono">
              <ScatterChart className="w-4 h-4 text-emerald-400" />
              {axisMode === 'pca' ? '2D Principal Component Space (PCA 1 vs PCA 2)' : 'Demographic Space (Annual Income k$ vs Spending Score)'}
            </h3>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 text-[11px] mr-1">Filter:</span>
              <button
                onClick={() => setSelectedClusterFilter('all')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                  selectedClusterFilter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All (500)
              </button>
              {clusterResult?.personas.map((p) => (
                <button
                  key={p.cluster_id}
                  onClick={() => setSelectedClusterFilter(p.cluster_id)}
                  style={{ color: p.color }}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-all ${
                    selectedClusterFilter === p.cluster_id
                      ? 'bg-slate-800 border-current shadow'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="h-[460px] bg-slate-950 rounded-xl border border-slate-800/90 relative overflow-hidden flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-500 font-mono">Partitioning customer space...</span>
              </div>
            ) : (
              <svg className="w-full h-full" viewBox="0 0 600 450">
                {/* Background Grid Lines */}
                <line x1="20" y1="225" x2="580" y2="225" stroke="#1e293b" strokeDasharray="3" />
                <line x1="300" y1="20" x2="300" y2="430" stroke="#1e293b" strokeDasharray="3" />
                <rect x="20" y="20" width="560" height="410" fill="none" stroke="#334155" strokeWidth="1" />

                {/* Axes Labels */}
                <text x="570" y="220" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                  {axisMode === 'pca' ? 'PCA 1 (57.6%)' : 'Annual Income ($k)'}
                </text>
                <text x="305" y="35" fill="#64748b" fontSize="10" textAnchor="start" fontFamily="monospace">
                  {axisMode === 'pca' ? 'PCA 2 (22.1%)' : 'Spending Score (1-100)'}
                </text>

                {/* Customer Points */}
                {filteredCustomers.map((c, idx) => {
                  const coords = getSvgCoordinates(c);
                  const clusterId = getCustomerCluster(c, idx);
                  const color = getPointColor(clusterId);
                  const isHovered = hoveredCustomer?.customer_id === c.customer_id;

                  return (
                    <circle
                      key={c.customer_id}
                      cx={coords.x}
                      cy={coords.y}
                      r={isHovered ? 7 : (clusterId === -1 ? 3.5 : 4.5)}
                      fill={color}
                      opacity={isHovered ? 1 : 0.82}
                      stroke={isHovered ? '#ffffff' : color}
                      strokeWidth={isHovered ? 2 : 0.5}
                      className="transition-all duration-150 cursor-pointer"
                      onMouseEnter={() => setHoveredCustomer(c)}
                      onMouseLeave={() => setHoveredCustomer(null)}
                    />
                  );
                })}

                {/* Centroid Crosshairs (for K-Means and GMM) */}
                {clusterResult?.centroids_pca && axisMode === 'pca' && clusterResult.centroids_pca.map((cent, cIdx) => {
                  const minX = -3.8, maxX = 3.8;
                  const minY = -3.2, maxY = 3.2;
                  const cx = ((cent[0] - minX) / (maxX - minX)) * 560 + 20;
                  const cy = 430 - ((cent[1] - minY) / (maxY - minY)) * 390 - 20;
                  const color = CLUSTER_COLORS[cIdx % CLUSTER_COLORS.length];

                  return (
                    <g key={cIdx}>
                      <circle cx={cx} cy={cy} r="10" fill="none" stroke={color} strokeWidth="2" strokeDasharray="3" />
                      <circle cx={cx} cy={cy} r="3" fill="#ffffff" stroke={color} strokeWidth="2" />
                      <text x={cx + 12} y={cy + 4} fill={color} fontSize="11" fontWeight="bold" fontFamily="monospace">
                        C{cIdx}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Hover Tooltip Overlay */}
            {hoveredCustomer && (
              <div className="absolute top-4 left-4 bg-slate-900/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs font-mono space-y-1.5 backdrop-blur pointer-events-none z-20">
                <div className="flex items-center justify-between gap-4 font-bold text-slate-100 border-b border-slate-800 pb-1">
                  <span>Customer #{hoveredCustomer.customer_id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px]" style={{
                    backgroundColor: `${getPointColor(getCustomerCluster(hoveredCustomer, customers.findIndex(c=>c.customer_id===hoveredCustomer.customer_id)))}33`,
                    color: getPointColor(getCustomerCluster(hoveredCustomer, customers.findIndex(c=>c.customer_id===hoveredCustomer.customer_id)))
                  }}>
                    {clusterResult?.personas.find(p=>p.cluster_id===getCustomerCluster(hoveredCustomer, customers.findIndex(c=>c.customer_id===hoveredCustomer.customer_id)))?.name || `Cluster ${getCustomerCluster(hoveredCustomer, 0)}`}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-300 text-[11px]">
                  <span>Income: <strong className="text-slate-100">${hoveredCustomer.annual_income}k</strong></span>
                  <span>Spending Score: <strong className="text-emerald-400">{hoveredCustomer.spending_score}</strong></span>
                  <span>Age: <strong className="text-slate-100">{hoveredCustomer.age} yrs</strong></span>
                  <span>Recency: <strong className="text-slate-100">{hoveredCustomer.recency}d</strong></span>
                  <span>Frequency: <strong className="text-slate-100">{hoveredCustomer.frequency} orders</strong></span>
                  <span>Monetary: <strong className="text-cyan-400">${hoveredCustomer.monetary}</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Active Cluster Persona Breakdown */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Identified Personas ({clusterResult?.personas.length || 0})
            </h3>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {clusterResult?.personas.map((persona) => (
                <div
                  key={persona.cluster_id}
                  onClick={() => setSelectedClusterFilter(selectedClusterFilter === persona.cluster_id ? 'all' : persona.cluster_id)}
                  style={{ borderColor: `${persona.color}50` }}
                  className={`p-3 bg-slate-950 rounded-xl border transition-all cursor-pointer ${
                    selectedClusterFilter === persona.cluster_id ? 'ring-2 ring-emerald-400' : 'hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs" style={{ color: persona.color }}>
                      {persona.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {persona.customer_count} ({persona.percentage}%)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {persona.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-900">
                    <span>Inc: ${persona.avg_income}k</span>
                    <span>Spend: {persona.avg_spending}</span>
                    <span className="text-emerald-400">{persona.campaign_roi_potential.split(' ')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
