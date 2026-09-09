import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import {
  CheckSquare,
  ListTodo,
  Kanban,
  Calendar,
  Grid2X2,
  BarChart3,
  Search,
  Plus,
  Timer,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles,
  Command,
  Download,
  Keyboard,
} from 'lucide-react';
import { AppView } from '../../types';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    filters,
    updateFilter,
    openCreateTaskModal,
    openPomodoro,
    setIsShortcutsOpen,
    setIsExportImportOpen,
    setIsCommandPaletteOpen,
    stats,
  } = useTasks();

  const { theme, setTheme, isSoundEnabled, toggleSound } = useTheme();

  const navItems: { view: AppView; label: string; icon: any; shortcut: string }[] = [
    { view: 'list', label: 'List', icon: ListTodo, shortcut: '1' },
    { view: 'kanban', label: 'Board', icon: Kanban, shortcut: '2' },
    { view: 'calendar', label: 'Calendar', icon: Calendar, shortcut: '3' },
    { view: 'matrix', label: 'Matrix', icon: Grid2X2, shortcut: '4' },
    { view: 'analytics', label: 'Analytics', icon: BarChart3, shortcut: '5' },
  ];

  const cycleTheme = () => {
    const sequence: ('dark' | 'light' | 'midnight' | 'sunset')[] = ['dark', 'midnight', 'sunset', 'light'];
    const nextIdx = (sequence.indexOf(theme) + 1) % sequence.length;
    setTheme(sequence[nextIdx]);
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                TaskFlow
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-md uppercase tracking-wider">
                Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {stats?.currentStreakDays ? `🔥 ${stats.currentStreakDays} day streak` : 'Personal Workspace'}
            </p>
          </div>
        </div>

        {/* Center: View Switcher Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 relative ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={`Switch to ${item.label} view (Key: ${item.shortcut})`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Search / Command palette trigger */}
        <div className="flex-1 max-w-xs relative hidden lg:block">
          <div
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center justify-between w-full px-3 py-1.5 text-xs bg-slate-900/90 border border-slate-800 rounded-lg text-slate-400 cursor-pointer hover:border-slate-700 hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Search tasks, commands...</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-400">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Action Icons & New Task */}
        <div className="flex items-center gap-2">
          {/* Pomodoro Timer button */}
          <button
            onClick={() => openPomodoro()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 rounded-lg transition-colors"
            title="Open Pomodoro Focus Timer (P)"
          >
            <Timer className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Focus</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-lg border transition-colors ${
              isSoundEnabled
                ? 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10'
                : 'text-slate-500 border-slate-800 bg-slate-900 hover:text-slate-400'
            }`}
            title={isSoundEnabled ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme switcher */}
          <button
            onClick={cycleTheme}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title={`Theme: ${theme.toUpperCase()} (Click to toggle)`}
          >
            {theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : theme === 'midnight' ? (
              <Sparkles className="w-4 h-4 text-cyan-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* Export / Backup */}
          <button
            onClick={() => setIsExportImportOpen(true)}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
            title="Import / Export Data"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Keyboard Shortcuts */}
          <button
            onClick={() => setIsShortcutsOpen(true)}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors hidden sm:block"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* New Task Button */}
          <button
            onClick={() => openCreateTaskModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
