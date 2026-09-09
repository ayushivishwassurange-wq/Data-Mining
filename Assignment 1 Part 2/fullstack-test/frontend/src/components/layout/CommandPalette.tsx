import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Search,
  Plus,
  CheckCircle2,
  Calendar,
  Grid2X2,
  ListTodo,
  Kanban,
  BarChart3,
  Moon,
  Sun,
  Sparkles,
  Timer,
  Download,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { AppView } from '../../types';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    tasks,
    setActiveView,
    openCreateTaskModal,
    openEditTaskModal,
    openPomodoro,
    setIsExportImportOpen,
    toggleTask,
  } = useTasks();

  const { theme, setTheme, toggleSound } = useTheme();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Handle global Cmd/Ctrl + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Build searchable items
  const commands = [
    {
      id: 'cmd-new',
      title: 'Create new task',
      category: 'Actions',
      icon: Plus,
      run: () => openCreateTaskModal(),
    },
    {
      id: 'cmd-focus',
      title: 'Start Pomodoro Focus Timer',
      category: 'Actions',
      icon: Timer,
      run: () => openPomodoro(),
    },
    {
      id: 'cmd-list',
      title: 'Go to List View',
      category: 'Navigation',
      icon: ListTodo,
      run: () => setActiveView('list'),
    },
    {
      id: 'cmd-kanban',
      title: 'Go to Board (Kanban) View',
      category: 'Navigation',
      icon: Kanban,
      run: () => setActiveView('kanban'),
    },
    {
      id: 'cmd-calendar',
      title: 'Go to Calendar View',
      category: 'Navigation',
      icon: Calendar,
      run: () => setActiveView('calendar'),
    },
    {
      id: 'cmd-matrix',
      title: 'Go to Eisenhower Matrix View',
      category: 'Navigation',
      icon: Grid2X2,
      run: () => setActiveView('matrix'),
    },
    {
      id: 'cmd-analytics',
      title: 'Go to Analytics & Stats View',
      category: 'Navigation',
      icon: BarChart3,
      run: () => setActiveView('analytics'),
    },
    {
      id: 'cmd-theme',
      title: `Toggle Theme (Current: ${theme})`,
      category: 'Preferences',
      icon: theme === 'light' ? Moon : Sun,
      run: () => setTheme(theme === 'dark' ? 'midnight' : theme === 'midnight' ? 'sunset' : theme === 'sunset' ? 'light' : 'dark'),
    },
    {
      id: 'cmd-export',
      title: 'Export / Import Backup Data',
      category: 'Data',
      icon: Download,
      run: () => setIsExportImportOpen(true),
    },
  ];

  // Match tasks
  const matchedTasks = tasks
    .filter((t) => !t.isArchived && t.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5)
    .map((t) => ({
      id: `task-${t.id}`,
      title: t.title,
      category: 'Tasks',
      icon: CheckCircle2,
      isCompleted: t.status === 'completed',
      run: () => openEditTaskModal(t),
    }));

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const allItems = [...matchedTasks, ...filteredCommands];

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        allItems[selectedIndex].run();
        setIsCommandPaletteOpen(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="bg-slate-900 border border-slate-700/80 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/60 gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownList}
            placeholder="Type a command or search tasks..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 rounded text-slate-400 shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {allItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching commands or tasks found
            </div>
          ) : (
            allItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.run();
                    setIsCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.title}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {item.category}
                    </span>
                    <ArrowRight className={`w-3 h-3 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>Command Palette</span>
        </div>
      </div>
    </div>
  );
};
