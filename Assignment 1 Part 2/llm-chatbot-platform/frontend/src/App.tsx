import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ChatInterface } from './components/ChatInterface';
import { AttentionVisualizer } from './components/AttentionVisualizer';
import { TokenizerSandbox } from './components/TokenizerSandbox';
import { AdminDashboard } from './components/AdminDashboard';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'attention' | 'tokenizer' | 'crisp-dm'>('chat');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab: any) => setActiveTab(tab)}
        crispPhase={6}
      />

      {/* Main Tab Views */}
      <main className="flex-1">
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'attention' && <AttentionVisualizer />}
        {activeTab === 'tokenizer' && <TokenizerSandbox />}
        {activeTab === 'crisp-dm' && <AdminDashboard />}
      </main>

      {/* Monorepo Project Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>Mini-LLM & Chatbot Platform • CRISP-DM Machine Learning Suite</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>PyTorch 2.14</span>
            <span>•</span>
            <span>FastAPI SSE</span>
            <span>•</span>
            <span>React 19</span>
            <span>•</span>
            <a 
              href="https://github.com/ayushivishwassurange-wq/Data-Mining" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-purple-400 underline transition-colors"
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
