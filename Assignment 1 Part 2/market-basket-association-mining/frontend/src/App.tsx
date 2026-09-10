import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import { EdaExplorer } from './components/EdaExplorer';
import { RuleExplorer } from './components/RuleExplorer';
import { NetworkGraphVisualizer } from './components/NetworkGraphVisualizer';
import { BasketRecommender } from './components/BasketRecommender';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('network');
  const [activeAlgo] = useState<string>('FP-Growth');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeAlgo={activeAlgo}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'network' && <NetworkGraphVisualizer />}
        {activeTab === 'cart' && <BasketRecommender />}
        {activeTab === 'rules' && <RuleExplorer />}
        {activeTab === 'eda' && <EdaExplorer />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Data Mining Portfolio &bull; Assignment 1 Part 2 &bull; Market Basket Association Mining</span>
          <span className="text-slate-400 font-mono">CRISP-DM 6-Phase Framework &bull; Ayushi Vishwas Surange</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
