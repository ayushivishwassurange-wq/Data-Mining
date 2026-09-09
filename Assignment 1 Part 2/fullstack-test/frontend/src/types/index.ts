export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type AppView = 'list' | 'kanban' | 'calendar' | 'matrix' | 'analytics';
export type ThemeMode = 'dark' | 'light' | 'midnight' | 'sunset';

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  tags: string[];
  dueDate: string | null;
  reminderDate?: string | null;
  estimatedMinutes?: number | null;
  actualMinutes: number;
  isArchived: boolean;
  order: number;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface ActivityLog {
  id: string;
  taskId?: string;
  taskTitle?: string;
  action: 'created' | 'updated' | 'completed' | 'uncompleted' | 'deleted' | 'subtask_toggled';
  details: string;
  timestamp: string;
}

export interface ProductivityStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completionRate: number;
  currentStreakDays: number;
  longestStreakDays: number;
  priorityBreakdown: Record<TaskPriority, number>;
  categoryBreakdown: Record<string, number>;
  tasksCompletedLast7Days: { date: string; count: number }[];
  totalTimeTrackedMinutes: number;
}

export interface TaskFilters {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  category?: string | 'all';
  tag?: string | 'all';
  search: string;
  quickFilter?: 'all' | 'today' | 'upcoming' | 'urgent' | 'completed' | 'archived';
  sortBy: 'order' | 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
  groupBy: 'none' | 'status' | 'priority' | 'category' | 'dueDate';
}
