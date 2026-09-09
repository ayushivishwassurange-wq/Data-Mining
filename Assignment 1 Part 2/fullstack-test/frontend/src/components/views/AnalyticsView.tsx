import React from 'react';
import { useTasks } from '../../context/TaskContext';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  AlertTriangle,
  Folder,
  Activity,
  Award,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const AnalyticsView: React.FC = () => {
  const { stats, activity, categories } = useTasks();

  if (!stats) return null;

  const maxDaily = Math.max(...stats.tasksCompletedLast7Days.map((d) => d.count), 1);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-amber-500/20 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Current Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <Flame className="w-5 h-5 animate-bounce" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{stats.currentStreakDays}</span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">days in a row</span>
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">
            Best streak: {stats.longestStreakDays} days
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-indigo-500/20 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Completion Rate</span>
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{stats.completionRate}%</span>
          </div>
          <div className="text-[11px] text-indigo-300 mt-1">
            {stats.completedTasks} of {stats.totalTasks} tasks finished
          </div>
        </div>

        {/* Active In Progress */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-sky-500/20 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">In Progress</span>
            <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{stats.inProgressTasks}</span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">tasks active</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.pendingTasks} in backlog
          </div>
        </div>

        {/* Time Tracked */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-emerald-500/20 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Time Logged</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{stats.totalTimeTrackedMinutes}</span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">minutes</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            ≈ {(stats.totalTimeTrackedMinutes / 60).toFixed(1)} hours focused
          </div>
        </div>
      </div>

      {/* 7-Day Completion Velocity Chart & Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Velocity Chart */}
        <div className="md:col-span-2 bg-slate-900/50 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                7-Day Velocity (Completed Tasks)
              </h3>
            </div>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
            {stats.tasksCompletedLast7Days.map((day) => {
              const heightPercent = Math.max((day.count / maxDaily) * 100, 8);
              let label = 'Today';
              try {
                label = format(parseISO(day.date), 'EEE');
              } catch {}

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-mono font-bold text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.count}
                  </span>
                  <div className="w-full bg-slate-800/80 rounded-xl h-32 flex items-end p-1">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-lg transition-all duration-500 group-hover:from-indigo-500 group-hover:to-cyan-400 shadow-lg shadow-indigo-600/30"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-200">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Priority Distribution
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Urgent (P1)', count: stats.priorityBreakdown.urgent, color: 'bg-rose-500' },
              { label: 'High (P2)', count: stats.priorityBreakdown.high, color: 'bg-amber-500' },
              { label: 'Medium (P3)', count: stats.priorityBreakdown.medium, color: 'bg-blue-500' },
              { label: 'Low (P4)', count: stats.priorityBreakdown.low, color: 'bg-emerald-500' },
            ].map((p) => {
              const pct = stats.totalTasks > 0 ? Math.round((p.count / stats.totalTasks) * 100) : 0;
              return (
                <div key={p.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{p.label}</span>
                    <span className="text-slate-400 font-mono">
                      {p.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${p.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Log Stream */}
      <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Recent Activity History
          </h3>
        </div>

        <div className="divide-y divide-slate-800/60 max-h-60 overflow-y-auto">
          {activity.map((log) => (
            <div key={log.id} className="py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    log.action === 'completed'
                      ? 'bg-emerald-400'
                      : log.action === 'created'
                      ? 'bg-indigo-400'
                      : log.action === 'deleted'
                      ? 'bg-rose-400'
                      : 'bg-slate-400'
                  }`}
                />
                <span className="text-slate-200">{log.details}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
