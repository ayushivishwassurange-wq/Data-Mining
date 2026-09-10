import React, { useState, useEffect } from 'react';
import { Network, Sparkles, Filter, Info, Eye, Layers, ArrowUpRight, Zap } from 'lucide-react';
import { api } from '../api/client';
import { NetworkGraphData, GraphNode, GraphLink } from '../types';

export const NetworkGraphVisualizer: React.FC = () => {
  const [graphData, setGraphData] = useState<NetworkGraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [minLiftFilter, setMinLiftFilter] = useState(2.0);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setLoading(true);
        const data = await api.getNetworkGraph();
        setGraphData(data);
      } catch (err) {
        console.error('Failed to load network graph:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, []);

  if (!graphData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500 font-mono text-sm">
        Building association rule network graph...
      </div>
    );
  }

  // Filter links by minimum Lift
  const filteredLinks = graphData.links.filter(l => l.lift >= minLiftFilter);

  // Layout node positions in a clean circular layout around (300, 240) radius 180
  const totalNodes = graphData.nodes.length;
  const centerX = 320;
  const centerY = 240;
  const radius = 175;

  const nodePositions: Record<string, { x: number; y: number; node: GraphNode }> = {};
  graphData.nodes.forEach((node, i) => {
    const angle = (i / totalNodes) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    nodePositions[node.id] = { x, y, node };
  });

  const isLinkActive = (l: GraphLink) => {
    if (!hoveredNode) return true;
    return l.source === hoveredNode || l.target === hoveredNode;
  };

  const isNodeActive = (nodeId: string) => {
    if (!hoveredNode) return true;
    if (nodeId === hoveredNode) return true;
    return filteredLinks.some(l => 
      (l.source === hoveredNode && l.target === nodeId) ||
      (l.target === hoveredNode && l.source === nodeId)
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Network className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                Directed Association Rule Network Graph
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Visualize high-lift market basket affinities as directed dependency links (<code className="text-amber-300 font-mono">Antecedent ➔ Consequent</code>). 
              Line thickness and amber glow reflect association <strong className="text-amber-400">Lift (1.5x to 5.0x)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Active Nodes</span>
              <strong className="text-amber-400 text-sm">{graphData.total_nodes} Items</strong>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block">Filtered Links</span>
              <strong className="text-emerald-400 text-sm">{filteredLinks.length} Rules</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-4 flex-1 min-w-[280px]">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-amber-400" /> Minimum Lift Filter: <strong className="text-amber-400">{minLiftFilter.toFixed(1)}x</strong>
          </span>
          <input
            type="range"
            min="1.2"
            max="4.8"
            step="0.1"
            value={minLiftFilter}
            onChange={(e) => setMinLiftFilter(parseFloat(e.target.value))}
            className="flex-1 accent-amber-500 max-w-xs"
          />
          <span className="text-[11px] text-slate-500">Prunes weaker affinities</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1"><span className="w-3 h-1 bg-amber-500 rounded" /> Strong Lift (&gt;3.5x)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-1 bg-teal-500 rounded" /> Moderate Lift (&gt;2.0x)</span>
        </div>
      </div>

      {/* Main Canvas & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: SVG Interactive Directed Graph */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="h-[480px] bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 640 480">
              <defs>
                {/* Arrowhead marker */}
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="16"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                </marker>
                <marker
                  id="arrow-dim"
                  viewBox="0 0 10 10"
                  refX="16"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#334155" />
                </marker>
              </defs>

              {/* Background circular guide */}
              <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#1e293b" strokeDasharray="4" />

              {/* Directed Links */}
              {filteredLinks.map((link, idx) => {
                const sourcePos = nodePositions[link.source];
                const targetPos = nodePositions[link.target];
                if (!sourcePos || !targetPos) return null;

                const active = isLinkActive(link);
                const strokeColor = !active 
                  ? '#1e293b' 
                  : link.lift >= 3.5 ? '#f59e0b' : '#14b8a6';
                const strokeWidth = active ? Math.min(Math.max((link.lift - 1.0) * 1.5, 1.2), 4.5) : 0.6;
                const opacity = active ? (hoveredNode ? 1 : 0.75) : 0.15;

                return (
                  <line
                    key={idx}
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    markerEnd={active ? "url(#arrow)" : "url(#arrow-dim)"}
                    className="transition-all duration-150"
                  />
                );
              })}

              {/* Nodes */}
              {graphData.nodes.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;

                const isHovered = hoveredNode === node.id;
                const active = isNodeActive(node.id);
                const nodeRadius = Math.min(Math.max(node.degree * 1.2 + 8, 10), 22);

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={nodeRadius}
                      fill={isHovered ? '#fbbf24' : active ? '#ea580c' : '#1e293b'}
                      opacity={active ? 1 : 0.3}
                      stroke={isHovered ? '#ffffff' : '#f97316'}
                      strokeWidth={isHovered ? 2.5 : 1}
                      className="transition-all duration-150"
                    />
                    {/* Node Label */}
                    <text
                      x={pos.x}
                      y={pos.y + (pos.y > centerY ? nodeRadius + 14 : -nodeRadius - 6)}
                      fill={active ? '#f1f5f9' : '#475569'}
                      fontSize={isHovered ? '11' : '9'}
                      fontWeight={isHovered ? 'bold' : 'normal'}
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredNode && (
              <div className="absolute top-4 left-4 bg-slate-900/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs font-mono space-y-1.5 backdrop-blur pointer-events-none z-20">
                <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 flex items-center justify-between gap-4">
                  <span>{hoveredNode}</span>
                  <span className="text-[10px] text-slate-400">Node Degree: {nodePositions[hoveredNode]?.node.degree} Rules</span>
                </div>
                <div className="text-slate-300 text-[11px] space-y-0.5 pt-1">
                  <div>Outgoing Consequences: <strong>{filteredLinks.filter(l=>l.source===hoveredNode).length} items</strong></div>
                  <div>Incoming Antecedents: <strong>{filteredLinks.filter(l=>l.target===hoveredNode).length} items</strong></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Active Rules Sidebar */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              Active Graph Affinities
            </h3>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {filteredLinks.slice(0, 12).map((l, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs font-mono space-y-1 hover:border-amber-500/50 transition-all"
                >
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span className="truncate max-w-[120px] text-amber-300">{l.source}</span>
                    <span className="text-slate-500">➔</span>
                    <span className="truncate max-w-[120px] text-teal-300">{l.target}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                    <span>Lift: <strong className="text-amber-400">{l.lift}x</strong></span>
                    <span>Conf: <strong className="text-teal-400">{(l.confidence*100).toFixed(0)}%</strong></span>
                    <span>Supp: <strong className="text-slate-300">{(l.support*100).toFixed(1)}%</strong></span>
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
