import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ListView } from './components/views/ListView';
import { KanbanView } from './components/views/KanbanView';
import { CalendarView } from './components/views/CalendarView';
import { MatrixView } from './components/views/MatrixView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { TaskModal } from './components/tasks/TaskModal';
import { BatchToolbar } from './components/tasks/BatchToolbar';
import { PomodoroModal } from './components/tasks/PomodoroModal';
import { CommandPalette } from './components/layout/CommandPalette';
import { ShortcutsModal } from './components/common/ShortcutsModal';
import { ExportImportModal } from './components/common/ExportImportModal';
import { Loader2, Menu } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, isLoading } = useTasks();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="text-xs font-semibold text-slate-400">Loading TaskFlow Pro workspace...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0b0f17]">
        {activeView === 'list' && <ListView />}
        {activeView === 'kanban' && <KanbanView />}
        {activeView === 'calendar' && <CalendarView />}
        {activeView === 'matrix' && <MatrixView />}
        {activeView === 'analytics' && <AnalyticsView />}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <TaskProvider>
        <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
          <Navbar />
          <MainContent />

          {/* Overlays & Modals */}
          <TaskModal />
          <BatchToolbar />
          <PomodoroModal />
          <CommandPalette />
          <ShortcutsModal />
          <ExportImportModal />
        </div>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default App;
