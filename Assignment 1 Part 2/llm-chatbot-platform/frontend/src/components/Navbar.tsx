import React from 'react';
import { Bot, Cpu, Network, Binary, LayoutDashboard, Sparkles, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  crispPhase: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, crispPhase }) => {
  const tabs = [
    { id: 'chat', label: 'AI Chat Studio', icon: Bot, badge: 'Live SSE' },
    { id: 'attention', label: 'Attention Heatmap', icon: Network, badge: 'RoPE' },
    { id: 'tokenizer', label: 'Tokenizer Sandbox', icon: Binary, badge: 'Subwords' },
    { id: 'crisp-dm', label: 'CRISP-DM Admin', icon: LayoutDashboard, badge: `Phase ${crispPhase}` },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-400 p-0.5 shadow-lg shadow-purple-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse-fast" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-200 to-violet-400">
                  Mini-LLM
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  CRISP-DM
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Decoder Transformer • 885k Params • Local Inference
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-md shadow-purple-900/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`hidden md:inline-block text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-purple-500/30 text-purple-200' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Model Ready (0.02 Loss)</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
