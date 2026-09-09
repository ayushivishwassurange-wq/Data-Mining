import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ClusterVisualizer } from './components/ClusterVisualizer';
import { CustomerClassifier } from './components/CustomerClassifier';
import { EdaExplorer } from './components/EdaExplorer';
import { AdminDashboard } from './components/AdminDashboard';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('visualizer');
  const [activeAlgo, setActiveAlgo] = useState<string>('K-MEANS');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeAlgo={activeAlgo}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'visualizer' && <ClusterVisualizer onAlgoChange={setActiveAlgo} />}
        {activeTab === 'classifier' && <CustomerClassifier />}
        {activeTab === 'eda' && <EdaExplorer />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Monorepo Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>Customer Segmentation & Clustering Platform • CRISP-DM Machine Learning Suite</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Scikit-Learn</span>
            <span>•</span>
            <span>FastAPI REST</span>
            <span>•</span>
            <span>React 19 + PCA</span>
            <span>•</span>
            <a 
              href="https://github.com/ayushivishwassurange-wq/Data-Mining" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-400 underline transition-colors"
            >
              GitHub Monorepo
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
