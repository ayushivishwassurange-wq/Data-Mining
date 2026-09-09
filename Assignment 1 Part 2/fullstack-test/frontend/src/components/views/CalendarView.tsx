import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Task } from '../../types';

export const CalendarView: React.FC = () => {
  const { filteredTasks, openCreateTaskModal, openEditTaskModal } = useTasks();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  // Build grid days
  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  // Map tasks by date string (YYYY-MM-DD)
  const tasksByDate = filteredTasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (task.dueDate) {
      const dateKey = task.dueDate.split('T')[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(task);
    }
    return acc;
  }, {});

  const weekDayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            Today
          </button>
          <div className="flex items-center gap-1 bg-slate-950 rounded-lg border border-slate-800 p-0.5">
            <button
              onClick={prevMonth}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-slate-900/40 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/60">
          {weekDayHeaders.map((d) => (
            <div key={d} className="py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {d}
            </div>
          ))}
        </div>

        {/* Month Day Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-800/60">
          {days.map((d, i) => {
            const dateKey = format(d, 'yyyy-MM-dd');
            const dayTasks = tasksByDate[dateKey] || [];
            const isCurrentMonth = isSameMonth(d, currentMonth);
            const isDayToday = isSameDay(d, new Date());

            return (
              <div
                key={i}
                onClick={() => openCreateTaskModal({ dueDate: `${dateKey}T18:00:00.000Z` })}
                className={`min-h-[110px] p-2 flex flex-col justify-between group transition-colors cursor-pointer hover:bg-slate-800/30 ${
                  !isCurrentMonth ? 'bg-slate-950/40 opacity-40' : 'bg-slate-900/20'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold ${
                      isDayToday
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {format(d, 'd')}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openCreateTaskModal({ dueDate: `${dateKey}T18:00:00.000Z` });
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-indigo-400 rounded transition-opacity"
                    title="Add task on this day"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Day Tasks List */}
                <div className="space-y-1 overflow-y-auto max-h-[85px] flex-1">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditTaskModal(task);
                      }}
                      className={`px-2 py-1 rounded text-[11px] truncate flex items-center gap-1.5 border transition-all ${
                        task.status === 'completed'
                          ? 'line-through bg-slate-950/60 text-slate-500 border-slate-800'
                          : task.priority === 'urgent'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 font-medium'
                          : task.priority === 'high'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-indigo-950/60 text-indigo-200 border-indigo-800/60'
                      }`}
                      title={task.title}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          task.status === 'completed' ? 'bg-slate-600' : 'bg-indigo-400'
                        }`}
                      />
                      <span className="truncate">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
