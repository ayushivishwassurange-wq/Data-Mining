import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Task, Category, ProductivityStats, ActivityLog, AppView, TaskFilters, TaskStatus, TaskPriority } from '../types';
import { api } from '../api/client';
import { soundEngine } from '../utils/sound';
import { triggerTaskCelebration, triggerBigCelebration } from '../utils/confetti';
import { useTheme } from './ThemeContext';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  categories: Category[];
  stats: ProductivityStats | null;
  activity: ActivityLog[];
  isLoading: boolean;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  filters: TaskFilters;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
  updateFilter: <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => void;
  resetFilters: () => void;
  
  // Selection
  selectedTaskIds: string[];
  toggleSelectTask: (id: string) => void;
  selectAllTasks: (taskIds: string[]) => void;
  clearSelection: () => void;

  // Modals
  isTaskModalOpen: boolean;
  openCreateTaskModal: (initialData?: Partial<Task>) => void;
  openEditTaskModal: (task: Task) => void;
  closeTaskModal: () => void;
  editingTask: Task | null;

  isPomodoroOpen: boolean;
  pomodoroTask: Task | null;
  openPomodoro: (task?: Task) => void;
  closePomodoro: () => void;
  recordFocusTime: (taskId: string, minutes: number) => Promise<void>;

  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;

  isExportImportOpen: boolean;
  setIsExportImportOpen: (open: boolean) => void;

  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Actions
  createTask: (data: Partial<Task> & { smartInput?: string }) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task>;
  toggleTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  reorderTasks: (taskIds: string[]) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  batchAction: (action: string, value?: string) => Promise<void>;

  // Subtasks
  addSubtask: (taskId: string, title: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;

  // Categories
  createCategory: (name: string, color: string, icon: string) => Promise<void>;

  refreshData: () => Promise<void>;
}

const defaultFilters: TaskFilters = {
  status: 'all',
  priority: 'all',
  category: 'all',
  tag: 'all',
  search: '',
  quickFilter: 'all',
  sortBy: 'order',
  sortOrder: 'asc',
  groupBy: 'none',
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSoundEnabled } = useTheme();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<ProductivityStats | null>(null);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [activeView, setActiveView] = useState<AppView>('list');
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [pomodoroTask, setPomodoroTask] = useState<Task | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Sync sound engine preference
  useEffect(() => {
    soundEngine.enabled = isSoundEnabled;
  }, [isSoundEnabled]);

  const loadData = useCallback(async () => {
    try {
      const [tasksRes, catRes, statsRes, actRes] = await Promise.all([
        api.getTasks({ isArchived: filters.quickFilter === 'archived' }),
        api.getCategories(),
        api.getStats(),
        api.getActivity(),
      ]);

      if (tasksRes.success) setTasks(tasksRes.data);
      if (catRes.success) setCategories(catRes.data);
      if (statsRes.success) setStats(statsRes.data);
      if (actRes.success) setActivity(actRes.data);
    } catch (err) {
      console.error('Error fetching data from API:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters.quickFilter]);

  // Initial load & real-time SSE listener
  useEffect(() => {
    loadData();

    // Subscribe to SSE updates from server for multi-tab sync
    const unsubscribe = api.subscribeToEvents((event) => {
      if (event.type === 'TASK_CREATED') {
        setTasks(prev => [event.payload, ...prev.filter(t => t.id !== event.payload.id)]);
        api.getStats().then(s => s.success && setStats(s.data));
      } else if (event.type === 'TASK_UPDATED') {
        setTasks(prev => prev.map(t => t.id === event.payload.id ? event.payload : t));
        api.getStats().then(s => s.success && setStats(s.data));
      } else if (event.type === 'TASK_DELETED') {
        setTasks(prev => prev.filter(t => t.id !== event.payload.id));
        api.getStats().then(s => s.success && setStats(s.data));
      } else if (event.type === 'TASKS_REORDERED' || event.type === 'BATCH_UPDATED' || event.type === 'DATA_IMPORTED') {
        loadData();
      }
    });

    return () => unsubscribe();
  }, [loadData]);

  const refreshData = async () => {
    await loadData();
  };

  const updateFilter = <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    const todayStr = new Date().toISOString().split('T')[0];

    // Quick filter
    if (filters.quickFilter === 'today') {
      result = result.filter(t => t.dueDate && t.dueDate.startsWith(todayStr));
    } else if (filters.quickFilter === 'upcoming') {
      result = result.filter(t => t.dueDate && t.dueDate.split('T')[0] > todayStr && t.status !== 'completed');
    } else if (filters.quickFilter === 'urgent') {
      result = result.filter(t => t.priority === 'urgent' && t.status !== 'completed');
    } else if (filters.quickFilter === 'completed') {
      result = result.filter(t => t.status === 'completed');
    } else if (filters.quickFilter === 'archived') {
      result = result.filter(t => t.isArchived);
    } else {
      // Default: exclude archived
      result = result.filter(t => !t.isArchived);
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter(t => t.status === filters.status);
    }

    // Priority filter
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(t => t.priority === filters.priority);
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter(t => t.category.toLowerCase() === filters.category?.toLowerCase());
    }

    // Tag filter
    if (filters.tag && filters.tag !== 'all') {
      result = result.filter(t => t.tags.some(tag => tag.toLowerCase() === filters.tag?.toLowerCase()));
    }

    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Sorting
    const priorityRank: Record<TaskPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
    const mult = filters.sortOrder === 'desc' ? -1 : 1;

    result.sort((a, b) => {
      if (filters.sortBy === 'priority') {
        return (priorityRank[a.priority] - priorityRank[b.priority]) * mult;
      }
      if (filters.sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * mult;
      }
      if (filters.sortBy === 'createdAt') {
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * mult;
      }
      if (filters.sortBy === 'title') {
        return a.title.localeCompare(b.title) * mult;
      }
      return (a.order - b.order) * mult;
    });

    return result;
  }, [tasks, filters]);

  // Selection handlers
  const toggleSelectTask = (id: string) => {
    setSelectedTaskIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllTasks = (taskIds: string[]) => {
    setSelectedTaskIds(taskIds);
  };

  const clearSelection = () => {
    setSelectedTaskIds([]);
  };

  // Modal openers
  const openCreateTaskModal = (initialData?: Partial<Task>) => {
    setEditingTask(initialData ? (initialData as Task) : null);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const openPomodoro = (task?: Task) => {
    setPomodoroTask(task || (filteredTasks.find(t => t.status === 'in_progress') || filteredTasks[0]) || null);
    setIsPomodoroOpen(true);
  };

  const closePomodoro = () => {
    setIsPomodoroOpen(false);
  };

  const recordFocusTime = async (taskId: string, minutes: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newActual = (task.actualMinutes || 0) + minutes;
      await updateTask(taskId, { actualMinutes: newActual });
    }
  };

  // Actions
  const createTask = async (data: Partial<Task> & { smartInput?: string }): Promise<Task> => {
    soundEngine.playPop();
    const res = await api.createTask(data);
    if (res.success) {
      setTasks(prev => [res.data, ...prev]);
      api.getStats().then(s => s.success && setStats(s.data));
      api.getActivity().then(a => a.success && setActivity(a.data));
      return res.data;
    }
    throw new Error('Failed to create task');
  };

  const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
    // Optimistic local update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
    const res = await api.updateTask(id, updates);
    if (res.success) {
      setTasks(prev => prev.map(t => t.id === id ? res.data : t));
      api.getStats().then(s => s.success && setStats(s.data));
      return res.data;
    }
    throw new Error('Failed to update task');
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const willBeCompleted = task.status !== 'completed';
    if (willBeCompleted) {
      soundEngine.playComplete();
      triggerTaskCelebration();
    } else {
      soundEngine.playPop();
    }

    // Optimistic toggle
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: willBeCompleted ? 'completed' : 'todo',
          completedAt: willBeCompleted ? new Date().toISOString() : null,
        };
      }
      return t;
    }));

    try {
      const res = await api.toggleTask(id);
      if (res.success) {
        setTasks(prev => prev.map(t => t.id === id ? res.data : t));
        api.getStats().then(s => s.success && setStats(s.data));
      }
    } catch (err) {
      // Rollback
      setTasks(prev => prev.map(t => t.id === id ? task : t));
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    soundEngine.playPop();
    if (status === 'completed') {
      soundEngine.playComplete();
      triggerTaskCelebration();
    }

    // Optimistic update
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status,
          completedAt: status === 'completed' ? new Date().toISOString() : null,
        };
      }
      return t;
    }));

    try {
      const res = await api.updateTaskStatus(id, status);
      if (res.success) {
        setTasks(prev => prev.map(t => t.id === id ? res.data : t));
        api.getStats().then(s => s.success && setStats(s.data));
      }
    } catch (err) {
      loadData();
    }
  };

  const reorderTasks = async (taskIds: string[]) => {
    const res = await api.reorderTasks(taskIds);
    if (res.success) {
      setTasks(res.data);
    }
  };

  const deleteTask = async (id: string) => {
    soundEngine.playDelete();
    setTasks(prev => prev.filter(t => t.id !== id));
    setSelectedTaskIds(prev => prev.filter(item => item !== id));
    await api.deleteTask(id);
    api.getStats().then(s => s.success && setStats(s.data));
  };

  const batchAction = async (action: string, value?: string) => {
    if (selectedTaskIds.length === 0) return;

    if (action === 'complete') {
      soundEngine.playComplete();
      triggerBigCelebration();
    } else if (action === 'delete') {
      soundEngine.playDelete();
    }

    const idsToAct = [...selectedTaskIds];
    clearSelection();

    await api.batchAction(action, idsToAct, value);
    await loadData();
  };

  // Subtasks
  const addSubtask = async (taskId: string, title: string) => {
    soundEngine.playPop();
    const res = await api.addSubtask(taskId, title);
    if (res.success) {
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return { ...t, subtasks: [...t.subtasks, res.data] };
        }
        return t;
      }));
    }
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    soundEngine.playPop();
    const res = await api.toggleSubtask(taskId, subtaskId);
    if (res.success) {
      const target = tasks.find(t => t.id === taskId);
      if (target) {
        const updatedSubtasks = target.subtasks.map(st => st.id === subtaskId ? res.data : st);
        const allDone = updatedSubtasks.every(st => st.completed);
        if (allDone && target.status !== 'completed') {
          soundEngine.playComplete();
          triggerTaskCelebration();
        }
        setTasks(prev => prev.map(t => t.id === taskId ? {
          ...t,
          subtasks: updatedSubtasks,
          status: allDone ? 'completed' : t.status,
        } : t));
      }
    }
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    soundEngine.playDelete();
    await api.deleteSubtask(taskId, subtaskId);
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, subtasks: t.subtasks.filter(st => st.id !== subtaskId) };
      }
      return t;
    }));
  };

  const createCategory = async (name: string, color: string, icon: string) => {
    const res = await api.createCategory({ name, color, icon });
    if (res.success) {
      setCategories(prev => [...prev, res.data]);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        categories,
        stats,
        activity,
        isLoading,
        activeView,
        setActiveView,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        selectedTaskIds,
        toggleSelectTask,
        selectAllTasks,
        clearSelection,
        isTaskModalOpen,
        openCreateTaskModal,
        openEditTaskModal,
        closeTaskModal,
        editingTask,
        isPomodoroOpen,
        pomodoroTask,
        openPomodoro,
        closePomodoro,
        recordFocusTime,
        isShortcutsOpen,
        setIsShortcutsOpen,
        isExportImportOpen,
        setIsExportImportOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        createTask,
        updateTask,
        toggleTask,
        updateTaskStatus,
        reorderTasks,
        deleteTask,
        batchAction,
        addSubtask,
        toggleSubtask,
        deleteSubtask,
        createCategory,
        refreshData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
