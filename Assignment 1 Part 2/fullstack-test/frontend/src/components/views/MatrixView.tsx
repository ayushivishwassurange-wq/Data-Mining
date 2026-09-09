import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from '../tasks/TaskCard';
import {
  AlertTriangle,
  CalendarCheck,
  Users,
  ArchiveX,
  Plus,
  Flame,
} from 'lucide-react';
import { Task } from '../../types';

export const MatrixView: React.FC = () => {
  const { filteredTasks, openCreateTaskModal } = useTasks();

  const activeTasks = filteredTasks.filter((t) => !t.isArchived);

  // Quadrant 1: Urgent & Important (Do First) -> priority: urgent, or high with due today/tomorrow
  const q1Tasks = activeTasks.filter((t) => t.priority === 'urgent');

  // Quadrant 2: Not Urgent but Important (Schedule) -> priority: high with no immediate deadline or medium
  const q2Tasks = activeTasks.filter((t) => t.priority === 'high');

  // Quadrant 3: Urgent but Less Important (Delegate/Quick) -> priority: medium
  const q3Tasks = activeTasks.filter((t) => t.priority === 'medium');

  // Quadrant 4: Neither Urgent nor Important (Eliminate/Low priority) -> priority: low
  const q4Tasks = activeTasks.filter((t) => t.priority === 'low');

  const quadrants = [
    {
      id: 'q1',
      title: 'Do First',
      subtitle: 'Urgent & Critical',
      icon: Flame,
      tasks: q1Tasks,
      priority: 'urgent' as const,
      headerClass: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      borderClass: 'border-rose-500/30',
    },
    {
      id: 'q2',
      title: 'Schedule',
      subtitle: 'Important & Strategic',
      icon: CalendarCheck,
      tasks: q2Tasks,
      priority: 'high' as const,
      headerClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      borderClass: 'border-amber-500/30',
    },
    {
      id: 'q3',
      title: 'Delegate / Quick',
      subtitle: 'Urgent & Routine',
      icon: Users,
      tasks: q3Tasks,
      priority: 'medium' as const,
      headerClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      borderClass: 'border-blue-500/30',
    },
    {
      id: 'q4',
      title: 'Eliminate / Backlog',
      subtitle: 'Low Impact',
      icon: ArchiveX,
      tasks: q4Tasks,
      priority: 'low' as const,
      headerClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      borderClass: 'border-emerald-500/30',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Intro explanation banner */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>🎯 Eisenhower Matrix Prioritization</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize tasks by urgency and importance to eliminate distractions and maximize high-value focus.
          </p>
        </div>
      </div>

      {/* 2x2 Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((quad) => {
          const Icon = quad.icon;
          return (
            <div
              key={quad.id}
              className={`bg-slate-900/40 rounded-2xl border ${quad.borderClass} p-4 flex flex-col min-h-[340px] shadow-lg`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg border ${quad.headerClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      {quad.title}
                    </h3>
                    <p className="text-[11px] text-slate-400">{quad.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-300">
                    {quad.tasks.length}
                  </span>
                  <button
                    onClick={() => openCreateTaskModal({ priority: quad.priority })}
                    className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title={`Add task in ${quad.title}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Task Items in Quadrant */}
              <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[380px] pr-1">
                {quad.tasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-600 border border-dashed border-slate-800 rounded-xl p-6 text-center">
                    No tasks in this quadrant
                  </div>
                ) : (
                  quad.tasks.map((task) => <TaskCard key={task.id} task={task} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
