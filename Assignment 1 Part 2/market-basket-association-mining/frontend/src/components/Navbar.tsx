import React from 'react';
import { Network, ShoppingCart, TableProperties, BarChart3, LayoutDashboard, Sparkles, Zap } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeAlgo: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, activeAlgo }) => {
  const tabs = [
    { id: 'network', label: 'Association Graph', icon: Network, badge: 'Directed SVG' },
    { id: 'cart', label: 'Cart Recommender', icon: ShoppingCart, badge: 'Live Cross-Sell' },
    { id: 'rules', label: 'Rule Explorer', icon: TableProperties, badge: 'Lift Scatter' },
    { id: 'eda', label: 'Basket EDA', icon: BarChart3, badge: '1,000 Baskets' },
    { id: 'admin', label: 'CRISP-DM Admin', icon: LayoutDashboard, badge: 'Phase 6' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-600 to-rose-400 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-200 to-rose-400">
                  PatternAI
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  CRISP-DM
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Market Basket Analysis • Apriori / FP-Growth / ECLAT
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
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-900/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`hidden md:inline-block text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-800 text-slate-400'
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-400 text-xs font-mono">
              <Zap className="w-3.5 h-3.5" />
              <span>{activeAlgo} Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
