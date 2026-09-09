import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import {
  Inbox,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Archive,
  Plus,
  Tag,
  Briefcase,
  User,
  BookOpen,
  Heart,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  Briefcase,
  User,
  BookOpen,
  Heart,
  DollarSign,
  Tag,
};

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen = true }) => {
  const { tasks, categories, filters, updateFilter, resetFilters, createCategory, stats } = useTasks();

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#6366f1');
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);

  // Compute counts
  const todayStr = new Date().toISOString().split('T')[0];
  const countAll = tasks.filter(t => !t.isArchived).length;
  const countToday = tasks.filter(t => !t.isArchived && t.dueDate && t.dueDate.startsWith(todayStr)).length;
  const countUpcoming = tasks.filter(t => !t.isArchived && t.dueDate && t.dueDate.split('T')[0] > todayStr && t.status !== 'completed').length;
  const countUrgent = tasks.filter(t => !t.isArchived && t.priority === 'urgent' && t.status !== 'completed').length;
  const countCompleted = tasks.filter(t => t.status === 'completed').length;
  const countArchived = tasks.filter(t => t.isArchived).length;

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await createCategory(newCatName.trim(), newCatColor, 'Tag');
    setNewCatName('');
    setIsAddingCategory(false);
  };

  const quickFilterItems = [
    { id: 'all', label: 'All Tasks', icon: Inbox, count: countAll, color: 'text-slate-300' },
    { id: 'today', label: 'Today', icon: Calendar, count: countToday, color: 'text-emerald-400' },
    { id: 'upcoming', label: 'Upcoming', icon: Clock, count: countUpcoming, color: 'text-sky-400' },
    { id: 'urgent', label: 'Urgent', icon: AlertTriangle, count: countUrgent, color: 'text-rose-400' },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: countCompleted, color: 'text-indigo-400' },
    { id: 'archived', label: 'Archived', icon: Archive, count: countArchived, color: 'text-slate-500' },
  ];

  return (
    <aside
      className={`w-64 shrink-0 bg-slate-950/60 border-r border-slate-800/80 p-4 flex flex-col justify-between overflow-y-auto max-h-[calc(100vh-65px)] ${
        isOpen ? 'block' : 'hidden lg:block'
      }`}
    >
      <div className="space-y-6">
        {/* Quick Filters */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
            Views & Filters
          </div>
          <div className="space-y-0.5">
            {quickFilterItems.map((item) => {
              const Icon = item.icon;
              const isActive = filters.quickFilter === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    updateFilter('quickFilter', item.id as any);
                    if (item.id === 'all') resetFilters();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      isActive ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories / Workspaces */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <button
              onClick={() => setCategoriesExpanded(!categoriesExpanded)}
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-300"
            >
              {categoriesExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <span>Categories</span>
            </button>
            <button
              onClick={() => setIsAddingCategory(!isAddingCategory)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-indigo-400 transition-colors"
              title="Add Category"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {isAddingCategory && (
            <form onSubmit={handleAddCategorySubmit} className="p-2 mb-2 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name..."
                className="w-full px-2 py-1 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-indigo-500"
                autoFocus
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewCatColor(col)}
                      className={`w-4 h-4 rounded-full border ${newCatColor === col ? 'ring-2 ring-white' : ''}`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="px-2 py-0.5 text-[10px] text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-2 py-0.5 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          )}

          {categoriesExpanded && (
            <div className="space-y-0.5">
              <button
                onClick={() => updateFilter('category', 'all')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  filters.category === 'all'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-500" />
                  <span>All Categories</span>
                </div>
              </button>

              {categories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.icon] || Tag;
                const catTaskCount = tasks.filter((t) => !t.isArchived && t.category.toLowerCase() === cat.id.toLowerCase()).length;
                const isActive = filters.category === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => updateFilter('category', isActive ? 'all' : cat.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-white font-medium ring-1 ring-slate-700'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">{catTaskCount}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Priority Filter */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
            Priority
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'urgent', label: 'Urgent', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
              { id: 'high', label: 'High', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
              { id: 'medium', label: 'Medium', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
              { id: 'low', label: 'Low', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            ].map((p) => {
              const isActive = filters.priority === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => updateFilter('priority', isActive ? 'all' : (p.id as any))}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium border text-center transition-all ${
                    isActive ? `${p.color} ring-1 ring-current font-bold` : 'border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-300'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer / Productivity Streak Card */}
      {stats && (
        <div className="mt-6 p-3 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>Productivity</span>
            </div>
            <span>{stats.completionRate}% Done</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>{stats.completedTasks} completed</span>
            <span>{stats.pendingTasks + stats.inProgressTasks} left</span>
          </div>
        </div>
      )}
    </aside>
  );
};
