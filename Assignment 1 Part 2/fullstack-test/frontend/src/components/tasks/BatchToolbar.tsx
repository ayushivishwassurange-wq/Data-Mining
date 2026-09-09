import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import {
  CheckCircle2,
  Trash2,
  AlertCircle,
  Briefcase,
  Archive,
  X,
  Layers,
} from 'lucide-react';
import { TaskPriority } from '../../types';

export const BatchToolbar: React.FC = () => {
  const {
    selectedTaskIds,
    clearSelection,
    batchAction,
    categories,
  } = useTasks();

  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  if (selectedTaskIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/95 backdrop-blur-xl border border-indigo-500/40 rounded-2xl shadow-2xl shadow-indigo-950/80 text-white text-xs">
        {/* Selection Count Pill */}
        <div className="flex items-center gap-2 pr-3 border-r border-slate-700/80">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px]">
            {selectedTaskIds.length}
          </span>
          <span className="font-semibold text-slate-200">
            {selectedTaskIds.length === 1 ? 'task selected' : 'tasks selected'}
          </span>
        </div>

        {/* Batch Actions */}
        <div className="flex items-center gap-1.5">
          {/* Mark Done */}
          <button
            onClick={() => batchAction('complete')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-colors"
            title="Complete all selected"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Complete</span>
          </button>

          {/* Set Priority Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowPriorityDropdown(!showPriorityDropdown);
                setShowCategoryDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Priority</span>
            </button>

            {showPriorityDropdown && (
              <div className="absolute bottom-full mb-2 left-0 w-32 bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-xl space-y-0.5">
                {(['urgent', 'high', 'medium', 'low'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      batchAction('set_priority', p);
                      setShowPriorityDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded text-xs capitalize text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Set Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowPriorityDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>Category</span>
            </button>

            {showCategoryDropdown && (
              <div className="absolute bottom-full mb-2 left-0 w-36 bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-xl space-y-0.5 max-h-48 overflow-y-auto">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      batchAction('set_category', c.id);
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 truncate"
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Archive */}
          <button
            onClick={() => batchAction('archive')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Archive selected"
          >
            <Archive className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Archive</span>
          </button>

          {/* Delete */}
          <button
            onClick={() => batchAction('delete')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-colors"
            title="Delete selected"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>

        {/* Clear / Dismiss */}
        <button
          onClick={clearSelection}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1"
          title="Clear Selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
