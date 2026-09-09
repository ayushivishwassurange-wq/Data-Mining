import React, { useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { X, Keyboard } from 'lucide-react';

export const ShortcutsModal: React.FC = () => {
  const {
    isShortcutsOpen,
    setIsShortcutsOpen,
    openCreateTaskModal,
    openPomodoro,
    setActiveView,
    setIsCommandPaletteOpen,
  } = useTasks();

  // Listen for global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      // Don't trigger when user is typing in an input or textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen(!isShortcutsOpen);
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        openCreateTaskModal();
      } else if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        openPomodoro();
      } else if (e.key === '1') {
        setActiveView('list');
      } else if (e.key === '2') {
        setActiveView('kanban');
      } else if (e.key === '3') {
        setActiveView('calendar');
      } else if (e.key === '4') {
        setActiveView('matrix');
      } else if (e.key === '5') {
        setActiveView('analytics');
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [isShortcutsOpen, setIsShortcutsOpen, openCreateTaskModal, openPomodoro, setActiveView]);

  if (!isShortcutsOpen) return null;

  const shortcutGroups = [
    {
      title: 'General & Navigation',
      items: [
        { key: '⌘ + K / Ctrl + K', desc: 'Open Command Palette' },
        { key: '1 - 5', desc: 'Switch Views (List, Board, Calendar, Matrix, Analytics)' },
        { key: '?', desc: 'Open this Keyboard Shortcuts cheatsheet' },
        { key: 'Esc', desc: 'Close open dialogs or clear selection' },
      ],
    },
    {
      title: 'Task Actions',
      items: [
        { key: 'N', desc: 'Create new task' },
        { key: 'P', desc: 'Start Pomodoro focus timer' },
        { key: 'Space', desc: 'Toggle task complete on active card' },
        { key: 'E', desc: 'Edit selected task' },
      ],
    },
    {
      title: 'Smart Input Tokens',
      items: [
        { key: '!urgent / !high / !low', desc: 'Set task priority' },
        { key: '@work / @personal', desc: 'Assign category / workspace' },
        { key: '#tag', desc: 'Add label / tag' },
        { key: 'tomorrow / today / in 3 days', desc: 'Smart natural language due date' },
        { key: '~30m / ~2h', desc: 'Estimated duration' },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsShortcutsOpen(false)}
    >
      <div
        className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <Keyboard className="w-4 h-4 text-indigo-400" />
            <span>Keyboard Shortcuts & Quick Syntax</span>
          </div>
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {shortcutGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {group.title}
              </h3>
              <div className="bg-slate-950/60 rounded-xl border border-slate-800/80 divide-y divide-slate-800/60">
                {group.items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between px-3.5 py-2 text-xs">
                    <span className="text-slate-300">{item.desc}</span>
                    <kbd className="px-2 py-0.5 font-mono text-[11px] bg-slate-800 border border-slate-700 rounded text-slate-300 shadow-sm">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
