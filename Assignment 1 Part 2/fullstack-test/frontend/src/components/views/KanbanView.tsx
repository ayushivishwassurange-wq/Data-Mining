import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from '../tasks/TaskCard';
import { TaskStatus, Task } from '../../types';
import {
  Plus,
  Circle,
  Clock,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface ColumnDef {
  id: TaskStatus;
  title: string;
  icon: any;
  headerColor: string;
  accentColor: string;
}

const COLUMNS: ColumnDef[] = [
  { id: 'todo', title: 'To Do', icon: Circle, headerColor: 'text-sky-400', accentColor: 'border-sky-500/30' },
  { id: 'in_progress', title: 'In Progress', icon: Clock, headerColor: 'text-amber-400', accentColor: 'border-amber-500/30' },
  { id: 'review', title: 'Under Review', icon: Eye, headerColor: 'text-purple-400', accentColor: 'border-purple-500/30' },
  { id: 'completed', title: 'Completed', icon: CheckCircle2, headerColor: 'text-emerald-400', accentColor: 'border-emerald-500/30' },
];

export const KanbanView: React.FC = () => {
  const { filteredTasks, updateTaskStatus, openCreateTaskModal } = useTasks();
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setActiveDragId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOverCol = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeaveCol = () => {
    setDragOverColumn(null);
  };

  const handleDropCol = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (!activeDragId) return;

    updateTaskStatus(activeDragId, status);
    setActiveDragId(null);
  };

  return (
    <div className="h-full flex gap-4 overflow-x-auto pb-4 items-start">
      {COLUMNS.map((col) => {
        const colTasks = filteredTasks.filter((t) => t.status === col.id);
        const Icon = col.icon;
        const isTarget = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOverCol(e, col.id)}
            onDragLeave={handleDragLeaveCol}
            onDrop={(e) => handleDropCol(e, col.id)}
            className={`w-80 shrink-0 flex flex-col bg-slate-900/40 rounded-2xl border transition-all duration-150 max-h-[calc(100vh-140px)] ${
              isTarget
                ? 'border-indigo-500 bg-indigo-950/20 ring-2 ring-indigo-500/30'
                : 'border-slate-800/80 hover:border-slate-800'
            }`}
          >
            {/* Column Header */}
            <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${col.headerColor}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {col.title}
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400">
                  {colTasks.length}
                </span>
              </div>

              <button
                onClick={() => openCreateTaskModal({ status: col.id })}
                className="p-1 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                title={`Add task in ${col.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Task Cards */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {colTasks.length === 0 ? (
                <div className="py-8 text-center text-slate-600 text-xs border border-dashed border-slate-800/80 rounded-xl">
                  Drop tasks here
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDragStart={(e) => handleDragStart(e, task.id)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
