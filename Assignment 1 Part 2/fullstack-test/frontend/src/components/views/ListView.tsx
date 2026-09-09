import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from '../tasks/TaskCard';
import { SmartTaskInput } from '../tasks/SmartTaskInput';
import {
  ListFilter,
  ArrowUpDown,
  Layers,
  Inbox,
  CheckCircle2,
  CheckSquare,
  Plus,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../../types';

export const ListView: React.FC = () => {
  const {
    filteredTasks,
    filters,
    updateFilter,
    reorderTasks,
    selectAllTasks,
    clearSelection,
    selectedTaskIds,
    openCreateTaskModal,
    categories,
  } = useTasks();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetId) return;

    const currentOrder = filteredTasks.map((t) => t.id);
    const fromIdx = currentOrder.indexOf(draggedTaskId);
    const toIdx = currentOrder.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    const newOrder = [...currentOrder];
    newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, draggedTaskId);

    reorderTasks(newOrder);
    setDraggedTaskId(null);
  };

  const allSelected =
    filteredTasks.length > 0 &&
    filteredTasks.every((t) => selectedTaskIds.includes(t.id));

  const handleToggleSelectAll = () => {
    if (allSelected) {
      clearSelection();
    } else {
      selectAllTasks(filteredTasks.map((t) => t.id));
    }
  };

  // Grouping logic
  const renderGroupedTasks = () => {
    if (filters.groupBy === 'none') {
      return (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, task.id)}
            />
          ))}
        </div>
      );
    }

    if (filters.groupBy === 'status') {
      const statuses: { key: TaskStatus; label: string; color: string }[] = [
        { key: 'todo', label: 'To Do', color: 'text-sky-400' },
        { key: 'in_progress', label: 'In Progress', color: 'text-amber-400' },
        { key: 'review', label: 'Under Review', color: 'text-purple-400' },
        { key: 'completed', label: 'Completed', color: 'text-emerald-400' },
      ];

      return (
        <div className="space-y-6">
          {statuses.map((s) => {
            const groupTasks = filteredTasks.filter((t) => t.status === s.key);
            if (groupTasks.length === 0) return null;
            return (
              <div key={s.key} className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-1.5">
                  <span className={`w-2 h-2 rounded-full ${s.color} bg-current`} />
                  <span>{s.label}</span>
                  <span className="text-[10px] font-mono text-slate-500 font-normal">({groupTasks.length})</span>
                </div>
                {groupTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            );
          })}
        </div>
      );
    }

    if (filters.groupBy === 'priority') {
      const priorities: { key: TaskPriority; label: string; color: string }[] = [
        { key: 'urgent', label: 'Urgent (P1)', color: 'text-rose-400' },
        { key: 'high', label: 'High (P2)', color: 'text-amber-400' },
        { key: 'medium', label: 'Medium (P3)', color: 'text-blue-400' },
        { key: 'low', label: 'Low (P4)', color: 'text-emerald-400' },
      ];

      return (
        <div className="space-y-6">
          {priorities.map((p) => {
            const groupTasks = filteredTasks.filter((t) => t.priority === p.key);
            if (groupTasks.length === 0) return null;
            return (
              <div key={p.key} className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-1.5">
                  <span className={`w-2 h-2 rounded-full ${p.color} bg-current`} />
                  <span>{p.label}</span>
                  <span className="text-[10px] font-mono text-slate-500 font-normal">({groupTasks.length})</span>
                </div>
                {groupTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            );
          })}
        </div>
      );
    }

    if (filters.groupBy === 'category') {
      return (
        <div className="space-y-6">
          {categories.map((cat) => {
            const groupTasks = filteredTasks.filter((t) => t.category.toLowerCase() === cat.id.toLowerCase());
            if (groupTasks.length === 0) return null;
            return (
              <div key={cat.id} className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{cat.name}</span>
                  <span className="text-[10px] font-mono text-slate-500 font-normal">({groupTasks.length})</span>
                </div>
                {groupTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Smart Natural Language Quick Input */}
      <SmartTaskInput />

      {/* View Options & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80 text-xs">
        {/* Left: Select All & Task Count */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSelectAll}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <CheckSquare className="w-4 h-4" />
            <span>{allSelected ? 'Deselect All' : 'Select All'}</span>
          </button>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-medium">
            Showing <strong className="text-slate-200">{filteredTasks.length}</strong> tasks
          </span>
        </div>

        {/* Right: Group by & Sort by controls */}
        <div className="flex items-center gap-2">
          {/* Group By */}
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-slate-300">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.groupBy}
              onChange={(e) => updateFilter('groupBy', e.target.value as any)}
              className="bg-transparent text-xs focus:outline-none cursor-pointer"
            >
              <option value="none">No Grouping</option>
              <option value="status">Group by Status</option>
              <option value="priority">Group by Priority</option>
              <option value="category">Group by Category</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as any)}
              className="bg-transparent text-xs focus:outline-none cursor-pointer"
            >
              <option value="order">Custom Order</option>
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
              <option value="createdAt">Date Created</option>
              <option value="title">Title (A-Z)</option>
            </select>
            <button
              onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="ml-1 text-[10px] font-bold text-slate-400 hover:text-indigo-400"
              title="Toggle Sort Order"
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Task List or Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">No tasks found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              There are no tasks matching your current view or filters. Create one above or clear your filters!
            </p>
          </div>
          <button
            onClick={() => openCreateTaskModal()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      ) : (
        renderGroupedTasks()
      )}
    </div>
  );
};
