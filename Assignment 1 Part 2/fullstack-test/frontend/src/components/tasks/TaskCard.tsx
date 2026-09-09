import React, { useState } from 'react';
import { Task, TaskPriority } from '../../types';
import { useTasks } from '../../context/TaskContext';
import {
  Check,
  Calendar,
  Clock,
  Tag,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Play,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  GripVertical,
  Plus,
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';

interface TaskCardProps {
  task: Task;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

const PRIORITY_BADGES: Record<TaskPriority, { label: string; class: string }> = {
  urgent: { label: 'Urgent', class: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
  high: { label: 'High', class: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  medium: { label: 'Medium', class: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  low: { label: 'Low', class: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isDraggable = true,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const {
    toggleTask,
    deleteTask,
    openEditTaskModal,
    openPomodoro,
    selectedTaskIds,
    toggleSelectTask,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    categories,
  } = useTasks();

  const [expandedSubtasks, setExpandedSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const isSelected = selectedTaskIds.includes(task.id);
  const isCompleted = task.status === 'completed';

  const categoryObj = categories.find((c) => c.id.toLowerCase() === task.category.toLowerCase());

  // Format Due Date
  const formatDue = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      const date = parseISO(dateStr);
      if (isToday(date)) {
        return { text: 'Today', isUrgent: true, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      }
      if (isTomorrow(date)) {
        return { text: 'Tomorrow', isUrgent: false, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      }
      if (isPast(date) && !isCompleted) {
        return { text: `Overdue (${format(date, 'MMM d')})`, isUrgent: true, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
      }
      return { text: format(date, 'MMM d, h:mm a'), isUrgent: false, color: 'text-slate-400 bg-slate-800/80 border-slate-700' };
    } catch {
      return null;
    }
  };

  const dueInfo = formatDue(task.dueDate);

  // Subtask progress
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length || 0;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    await addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
    setIsAddingSubtask(false);
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`group relative bg-slate-900/80 hover:bg-slate-900 border rounded-xl p-3.5 transition-all duration-150 ${
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-950/20'
          : isCompleted
          ? 'border-slate-800/50 opacity-65'
          : 'border-slate-800 hover:border-slate-700 hover:shadow-md hover:shadow-black/30'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle & Selection Checkbox */}
        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          <button
            onClick={() => toggleSelectTask(task.id)}
            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
              isSelected
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'border-slate-700 hover:border-slate-500 bg-slate-950'
            }`}
            title="Select for batch action"
          >
            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
          </button>

          <div className="text-slate-600 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity">
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Task Main Checkbox */}
        <button
          onClick={() => toggleTask(task.id)}
          className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 transition-all duration-150 ${
            isCompleted
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/50'
              : 'border-slate-600 hover:border-indigo-400 hover:bg-indigo-500/10 text-transparent'
          }`}
          title={isCompleted ? 'Mark as incomplete' : 'Mark as complete (Space)'}
        >
          <Check className={`w-3.5 h-3.5 stroke-[3] ${isCompleted ? 'scale-100' : 'scale-0'} transition-transform duration-150`} />
        </button>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => openEditTaskModal(task)}
              className={`text-sm font-semibold cursor-pointer select-none transition-colors ${
                isCompleted ? 'line-through text-slate-500' : 'text-slate-100 hover:text-indigo-300'
              }`}
            >
              {task.title}
            </h3>

            {/* Hover Quick Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                onClick={() => openPomodoro(task)}
                className="p-1 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded transition-colors"
                title="Start Focus Timer on this task"
              >
                <Play className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => openEditTaskModal(task)}
                className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded transition-colors"
                title="Edit Task (E)"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 select-none">
              {task.description}
            </p>
          )}

          {/* Meta Badges (Priority, Category, Due Date, Tags, Est Time) */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            {/* Priority */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                PRIORITY_BADGES[task.priority].class
              }`}
            >
              <AlertCircle className="w-2.5 h-2.5" />
              {PRIORITY_BADGES[task.priority].label}
            </span>

            {/* Category */}
            {categoryObj && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: categoryObj.color }} />
                {categoryObj.name}
              </span>
            )}

            {/* Due Date */}
            {dueInfo && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border ${dueInfo.color}`}>
                <Calendar className="w-2.5 h-2.5" />
                {dueInfo.text}
              </span>
            )}

            {/* Tags */}
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-950/40 text-indigo-300 border border-indigo-900/60"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}

            {/* Time Tracking (Estimated & Actual) */}
            {(task.estimatedMinutes || task.actualMinutes > 0) && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-amber-300/80 bg-amber-950/30 border border-amber-900/40">
                <Clock className="w-2.5 h-2.5" />
                {task.actualMinutes > 0 ? `${task.actualMinutes}m` : ''}
                {task.estimatedMinutes ? ` / ~${task.estimatedMinutes}m` : ''}
              </span>
            )}
          </div>

          {/* Subtasks Progress Bar & Toggle */}
          {totalSubtasks > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-800/60">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setExpandedSubtasks(!expandedSubtasks)}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {expandedSubtasks ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  <span>
                    Subtasks ({completedSubtasks}/{totalSubtasks})
                  </span>
                </button>

                <span className="text-[10px] font-mono text-slate-500">{subtaskProgress}%</span>
              </div>

              <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${subtaskProgress}%` }}
                />
              </div>

              {/* Expanded Subtask Checklist */}
              {expandedSubtasks && (
                <div className="mt-2 space-y-1 pl-1">
                  {task.subtasks.map((st) => (
                    <div key={st.id} className="flex items-center justify-between group/st py-0.5 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={() => toggleSubtask(task.id, st.id)}
                          className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                        />
                        <span className={`text-xs ${st.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                          {st.title}
                        </span>
                      </label>
                      <button
                        onClick={() => deleteSubtask(task.id, st.id)}
                        className="opacity-0 group-hover/st:opacity-100 text-slate-600 hover:text-rose-400 text-xs px-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* Add Subtask input inline */}
                  {isAddingSubtask ? (
                    <form onSubmit={handleAddSubtask} className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        placeholder="New subtask..."
                        className="flex-1 px-2 py-0.5 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-indigo-500"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-2 py-0.5 text-[10px] bg-indigo-600 text-white rounded font-medium"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingSubtask(false)}
                        className="text-slate-400 text-xs"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsAddingSubtask(true)}
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-400 mt-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add subtask</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
