import React, { useState, useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import {
  Plus,
  Sparkles,
  Calendar,
  AlertCircle,
  Tag,
  Clock,
  Briefcase,
  CornerDownLeft,
} from 'lucide-react';
import { TaskPriority } from '../../types';

export const SmartTaskInput: React.FC = () => {
  const { createTask, categories } = useTasks();
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Live client-side NLP parser for visual hint chips
  const parsedPreview = useMemo(() => {
    if (!input.trim()) return null;

    let text = input;
    let priority: TaskPriority | null = null;
    let category: string | null = null;
    const tags: string[] = [];
    let dateStr: string | null = null;
    let est: string | null = null;

    // Priority
    const pMatch = text.match(/!(urgent|high|medium|low|p1|p2|p3|p4)\b/i);
    if (pMatch) {
      const p = pMatch[1].toLowerCase();
      if (p === 'urgent' || p === 'p1') priority = 'urgent';
      else if (p === 'high' || p === 'p2') priority = 'high';
      else if (p === 'medium' || p === 'p3') priority = 'medium';
      else if (p === 'low' || p === 'p4') priority = 'low';
    }

    // Category
    const cMatch = text.match(/@([a-zA-Z0-9_-]+)/);
    if (cMatch) {
      category = cMatch[1];
    }

    // Tags
    const tMatches = text.matchAll(/#([a-zA-Z0-9_-]+)/g);
    for (const match of tMatches) {
      tags.push(match[1]);
    }

    // Est
    const eMatch = text.match(/~(\d+)(m|h|mins|hours?)\b/i);
    if (eMatch) {
      est = `${eMatch[1]}${eMatch[2]}`;
    }

    // Date
    const lower = text.toLowerCase();
    if (lower.includes('today')) dateStr = 'Today';
    else if (lower.includes('tomorrow') || lower.includes('tmrw')) dateStr = 'Tomorrow';
    else if (lower.includes('next week')) dateStr = 'Next Week';
    else if (text.match(/\bin\s+(\d+)\s+days?\b/i)) {
      const m = text.match(/\bin\s+(\d+)\s+days?\b/i);
      dateStr = `In ${m![1]} days`;
    }

    return {
      hasTokens: !!(priority || category || tags.length || dateStr || est),
      priority,
      category,
      tags,
      dateStr,
      est,
    };
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createTask({ smartInput: input.trim(), title: input.trim() });
      setInput('');
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertToken = (token: string) => {
    setInput(prev => `${prev.trim()} ${token} `);
  };

  return (
    <div className="w-full mb-6">
      <form
        onSubmit={handleSubmit}
        className={`relative bg-slate-900/90 rounded-2xl border transition-all duration-200 shadow-lg ${
          isFocused
            ? 'border-indigo-500/80 shadow-indigo-500/10 ring-2 ring-indigo-500/20'
            : 'border-slate-800 hover:border-slate-700 shadow-black/20'
        }`}
      >
        <div className="flex items-center px-4 py-3 gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder='Quick add or natural language: "Review pull request tomorrow at 4pm !urgent #code @work ~30m"'
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="submit"
              disabled={!input.trim() || isSubmitting}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                input.trim()
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Add</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Detected Tokens Preview */}
        {parsedPreview?.hasTokens && (
          <div className="px-4 pb-2.5 pt-0 flex flex-wrap items-center gap-2 border-t border-slate-800/60 mt-1 pt-2 animate-fade-in">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Detected:</span>

            {parsedPreview.dateStr && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <Calendar className="w-3 h-3" />
                {parsedPreview.dateStr}
              </span>
            )}

            {parsedPreview.priority && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                <AlertCircle className="w-3 h-3" />
                {parsedPreview.priority.toUpperCase()}
              </span>
            )}

            {parsedPreview.category && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                <Briefcase className="w-3 h-3" />
                @{parsedPreview.category}
              </span>
            )}

            {parsedPreview.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-500/15 text-sky-300 border border-sky-500/30">
                <Tag className="w-3 h-3" />
                #{tag}
              </span>
            ))}

            {parsedPreview.est && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Clock className="w-3 h-3" />
                ~{parsedPreview.est}
              </span>
            )}
          </div>
        )}

        {/* Quick token suggestions helper bar when input is focused */}
        {isFocused && !parsedPreview?.hasTokens && (
          <div className="px-4 py-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span>Quick tags:</span>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); insertToken('!urgent'); }}
                className="hover:text-rose-400 transition-colors"
              >
                !urgent
              </button>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); insertToken('tomorrow'); }}
                className="hover:text-emerald-400 transition-colors"
              >
                tomorrow
              </button>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); insertToken('#work'); }}
                className="hover:text-indigo-400 transition-colors"
              >
                #work
              </button>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); insertToken('~30m'); }}
                className="hover:text-amber-400 transition-colors"
              >
                ~30m
              </button>
            </div>
            <span className="text-slate-500 hidden sm:inline">Press Enter ↵</span>
          </div>
        )}
      </form>
    </div>
  );
};
