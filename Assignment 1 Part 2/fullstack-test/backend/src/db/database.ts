import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Task, Category, ActivityLog, ProductivityStats, TaskPriority, TaskStatus, Subtask } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'tasks_store.json');

interface DatabaseSchema {
  tasks: Task[];
  categories: Category[];
  activityLogs: ActivityLog[];
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: 'Work & Projects', color: '#6366f1', icon: 'Briefcase' },
  { id: 'personal', name: 'Personal', color: '#ec4899', icon: 'User' },
  { id: 'study', name: 'Learning & Study', color: '#3b82f6', icon: 'BookOpen' },
  { id: 'health', name: 'Health & Wellness', color: '#10b981', icon: 'Heart' },
  { id: 'finance', name: 'Finance', color: '#f59e0b', icon: 'DollarSign' },
];

function getInitialSeedTasks(): Task[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const in3Days = new Date(today);
  in3Days.setDate(in3Days.getDate() + 3);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return [
    {
      id: uuidv4(),
      title: 'Architect dynamic fullstack Todo list system',
      description: 'Design responsive frontend with React 19, Tailwind, Lucide, and real-time SSE streaming backend.',
      status: 'completed',
      priority: 'urgent',
      category: 'work',
      tags: ['fullstack', 'architecture', 'react19'],
      dueDate: yesterday.toISOString(),
      estimatedMinutes: 60,
      actualMinutes: 45,
      isArchived: false,
      order: 0,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: new Date(Date.now() - 86400000).toISOString(),
      subtasks: [
        { id: uuidv4(), taskId: '', title: 'Design database schema & types', completed: true, order: 0, createdAt: new Date().toISOString() },
        { id: uuidv4(), taskId: '', title: 'Define REST API routes & SSE events', completed: true, order: 1, createdAt: new Date().toISOString() },
        { id: uuidv4(), taskId: '', title: 'Implement Kanban & Matrix views', completed: true, order: 2, createdAt: new Date().toISOString() },
      ],
    },
    {
      id: uuidv4(),
      title: 'Finalize quarterly product roadmap review',
      description: 'Gather feature requests from team members and prioritize deliverables for Q3.',
      status: 'in_progress',
      priority: 'urgent',
      category: 'work',
      tags: ['strategy', 'planning', 'q3'],
      dueDate: today.toISOString(),
      estimatedMinutes: 90,
      actualMinutes: 30,
      isArchived: false,
      order: 1,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
      subtasks: [
        { id: uuidv4(), taskId: '', title: 'Review stakeholder feedback', completed: true, order: 0, createdAt: new Date().toISOString() },
        { id: uuidv4(), taskId: '', title: 'Draft milestone deliverables', completed: false, order: 1, createdAt: new Date().toISOString() },
        { id: uuidv4(), taskId: '', title: 'Present slide deck in sync meeting', completed: false, order: 2, createdAt: new Date().toISOString() },
      ],
    },
    {
      id: uuidv4(),
      title: 'Implement natural language task parsing',
      description: 'Support quick input like "Call accountant tomorrow at 3pm !high #finance".',
      status: 'in_progress',
      priority: 'high',
      category: 'work',
      tags: ['nlp', 'ux', 'features'],
      dueDate: tomorrow.toISOString(),
      estimatedMinutes: 45,
      actualMinutes: 15,
      isArchived: false,
      order: 2,
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
      subtasks: [
        { id: uuidv4(), taskId: '', title: 'Regex priority and category extractors', completed: true, order: 0, createdAt: new Date().toISOString() },
        { id: uuidv4(), taskId: '', title: 'Smart relative date parser (today, tmrw, next week)', completed: true, order: 1, createdAt: new Date().toISOString() },
      ],
    },
    {
      id: uuidv4(),
      title: 'Morning 5km jog & hydration routine',
      description: 'Hit the park trail before work and stretch for 10 minutes.',
      status: 'completed',
      priority: 'medium',
      category: 'health',
      tags: ['running', 'wellness', 'morning'],
      dueDate: today.toISOString(),
      estimatedMinutes: 40,
      actualMinutes: 35,
      isArchived: false,
      order: 3,
      createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      completedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      subtasks: [],
    },
    {
      id: uuidv4(),
      title: 'Read 2 chapters of "Designing Data-Intensive Applications"',
      description: 'Focus on replication logs and distributed consensus algorithms.',
      status: 'todo',
      priority: 'medium',
      category: 'study',
      tags: ['reading', 'system-design', 'books'],
      dueDate: in3Days.toISOString(),
      estimatedMinutes: 60,
      actualMinutes: 0,
      isArchived: false,
      order: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
      subtasks: [
        { id: uuidv4(), taskId: '', title: 'Chapter 5: Replication', completed: false, order: 0, createdAt: new Date().toISOString() },
        { id: uuidv4(), taskId: '', title: 'Chapter 6: Partitioning', completed: false, order: 1, createdAt: new Date().toISOString() },
        { id: uuidv4(), taskId: '', title: 'Take structured markdown notes', completed: false, order: 2, createdAt: new Date().toISOString() },
      ],
    },
    {
      id: uuidv4(),
      title: 'Review investment portfolio & monthly budget',
      description: 'Audit recurring subscriptions and allocate emergency savings fund.',
      status: 'todo',
      priority: 'low',
      category: 'finance',
      tags: ['budget', 'savings'],
      dueDate: null,
      estimatedMinutes: 30,
      actualMinutes: 0,
      isArchived: false,
      order: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
      subtasks: [],
    },
  ];
}

class Database {
  private data: DatabaseSchema = {
    tasks: [],
    categories: DEFAULT_CATEGORIES,
    activityLogs: [],
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        // Ensure default categories exist if missing
        if (!this.data.categories || this.data.categories.length === 0) {
          this.data.categories = DEFAULT_CATEGORIES;
        }
      } else {
        // Initialize with default seeds
        this.data = {
          tasks: getInitialSeedTasks(),
          categories: DEFAULT_CATEGORIES,
          activityLogs: [
            {
              id: uuidv4(),
              action: 'created',
              details: 'TaskFlow Pro database initialized with sample tasks',
              timestamp: new Date().toISOString(),
            },
          ],
        };
        this.save();
      }
    } catch (err) {
      console.error('Error initializing database file:', err);
      this.data = {
        tasks: getInitialSeedTasks(),
        categories: DEFAULT_CATEGORIES,
        activityLogs: [],
      };
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  // --- Task Operations ---
  getTasks(filters?: {
    status?: TaskStatus;
    priority?: TaskPriority;
    category?: string;
    tag?: string;
    search?: string;
    isArchived?: boolean;
    sortBy?: 'order' | 'dueDate' | 'priority' | 'createdAt' | 'title';
    sortOrder?: 'asc' | 'desc';
  }): Task[] {
    let result = [...this.data.tasks];

    // Default: exclude archived unless requested
    if (filters?.isArchived !== undefined) {
      result = result.filter(t => t.isArchived === filters.isArchived);
    } else {
      result = result.filter(t => !t.isArchived);
    }

    if (filters?.status) {
      result = result.filter(t => t.status === filters.status);
    }

    if (filters?.priority) {
      result = result.filter(t => t.priority === filters.priority);
    }

    if (filters?.category) {
      result = result.filter(t => t.category.toLowerCase() === filters.category?.toLowerCase());
    }

    if (filters?.tag) {
      result = result.filter(t => t.tags.some(tag => tag.toLowerCase() === filters.tag?.toLowerCase()));
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Sort
    const sortBy = filters?.sortBy || 'order';
    const sortOrder = filters?.sortOrder || 'asc';
    const multiplier = sortOrder === 'desc' ? -1 : 1;

    const priorityRank: Record<TaskPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

    result.sort((a, b) => {
      if (sortBy === 'priority') {
        return (priorityRank[a.priority] - priorityRank[b.priority]) * multiplier;
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * multiplier;
      }
      if (sortBy === 'createdAt') {
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * multiplier;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title) * multiplier;
      }
      // default: order
      return (a.order - b.order) * multiplier;
    });

    return result;
  }

  getTaskById(id: string): Task | undefined {
    return this.data.tasks.find(t => t.id === id);
  }

  createTask(taskData: Partial<Task>): Task {
    const maxOrder = this.data.tasks.reduce((max, t) => Math.max(max, t.order || 0), -1);
    const now = new Date().toISOString();
    
    const newTask: Task = {
      id: uuidv4(),
      title: taskData.title?.trim() || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      category: taskData.category || 'work',
      tags: taskData.tags || [],
      dueDate: taskData.dueDate || null,
      reminderDate: taskData.reminderDate || null,
      estimatedMinutes: taskData.estimatedMinutes || null,
      actualMinutes: taskData.actualMinutes || 0,
      isArchived: false,
      order: maxOrder + 1,
      subtasks: (taskData.subtasks || []).map((st, i) => ({
        id: st.id || uuidv4(),
        taskId: '',
        title: st.title,
        completed: !!st.completed,
        order: i,
        createdAt: now,
      })),
      createdAt: now,
      updatedAt: now,
      completedAt: taskData.status === 'completed' ? now : null,
    };

    newTask.subtasks.forEach(st => st.taskId = newTask.id);

    this.data.tasks.unshift(newTask);
    this.logActivity('created', `Created task: "${newTask.title}"`, newTask.id, newTask.title);
    this.save();
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const idx = this.data.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;

    const current = this.data.tasks[idx];
    const now = new Date().toISOString();

    let completedAt = current.completedAt;
    if (updates.status) {
      if (updates.status === 'completed' && current.status !== 'completed') {
        completedAt = now;
      } else if (updates.status !== 'completed') {
        completedAt = null;
      }
    }

    const updatedTask: Task = {
      ...current,
      ...updates,
      id: current.id, // prevent ID change
      updatedAt: now,
      completedAt,
    };

    this.data.tasks[idx] = updatedTask;
    this.logActivity('updated', `Updated task: "${updatedTask.title}"`, updatedTask.id, updatedTask.title);
    this.save();
    return updatedTask;
  }

  toggleTaskCompletion(id: string): Task | null {
    const task = this.getTaskById(id);
    if (!task) return null;

    const isNowCompleted = task.status !== 'completed';
    const newStatus: TaskStatus = isNowCompleted ? 'completed' : 'todo';
    const now = new Date().toISOString();

    return this.updateTask(id, {
      status: newStatus,
      completedAt: isNowCompleted ? now : null,
    });
  }

  deleteTask(id: string): boolean {
    const idx = this.data.tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;

    const removed = this.data.tasks.splice(idx, 1)[0];
    this.logActivity('deleted', `Deleted task: "${removed.title}"`, removed.id, removed.title);
    this.save();
    return true;
  }

  reorderTasks(taskIds: string[]): Task[] {
    taskIds.forEach((id, index) => {
      const task = this.data.tasks.find(t => t.id === id);
      if (task) {
        task.order = index;
        task.updatedAt = new Date().toISOString();
      }
    });
    this.save();
    return this.getTasks();
  }

  batchUpdate(action: 'complete' | 'delete' | 'set_priority' | 'set_category' | 'archive', taskIds: string[], value?: string): { success: boolean; modifiedCount: number } {
    const now = new Date().toISOString();
    let modified = 0;

    if (action === 'delete') {
      const initialCount = this.data.tasks.length;
      this.data.tasks = this.data.tasks.filter(t => !taskIds.includes(t.id));
      modified = initialCount - this.data.tasks.length;
      this.logActivity('deleted', `Batch deleted ${modified} tasks`);
    } else {
      this.data.tasks.forEach(task => {
        if (taskIds.includes(task.id)) {
          modified++;
          if (action === 'complete') {
            task.status = 'completed';
            task.completedAt = now;
          } else if (action === 'set_priority' && value) {
            task.priority = value as TaskPriority;
          } else if (action === 'set_category' && value) {
            task.category = value;
          } else if (action === 'archive') {
            task.isArchived = true;
          }
          task.updatedAt = now;
        }
      });
      this.logActivity('updated', `Batch executed "${action}" on ${modified} tasks`);
    }

    this.save();
    return { success: true, modifiedCount: modified };
  }

  // --- Subtask Operations ---
  addSubtask(taskId: string, title: string): Subtask | null {
    const task = this.getTaskById(taskId);
    if (!task) return null;

    const subtask: Subtask = {
      id: uuidv4(),
      taskId,
      title: title.trim(),
      completed: false,
      order: task.subtasks.length,
      createdAt: new Date().toISOString(),
    };

    task.subtasks.push(subtask);
    task.updatedAt = new Date().toISOString();
    this.save();
    return subtask;
  }

  toggleSubtask(taskId: string, subtaskId: string): Subtask | null {
    const task = this.getTaskById(taskId);
    if (!task) return null;

    const subtask = task.subtasks.find(st => st.id === subtaskId);
    if (!subtask) return null;

    subtask.completed = !subtask.completed;
    task.updatedAt = new Date().toISOString();

    // Auto-update task status if all subtasks are complete
    if (task.subtasks.length > 0 && task.subtasks.every(st => st.completed) && task.status !== 'completed') {
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
    }

    this.save();
    return subtask;
  }

  deleteSubtask(taskId: string, subtaskId: string): boolean {
    const task = this.getTaskById(taskId);
    if (!task) return false;

    const initialLen = task.subtasks.length;
    task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
    task.updatedAt = new Date().toISOString();
    this.save();
    return task.subtasks.length < initialLen;
  }

  // --- Category Operations ---
  getCategories(): Category[] {
    return this.data.categories;
  }

  createCategory(category: Omit<Category, 'id'>): Category {
    const newCategory: Category = {
      id: category.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: category.name,
      color: category.color || '#6366f1',
      icon: category.icon || 'Tag',
    };
    this.data.categories.push(newCategory);
    this.save();
    return newCategory;
  }

  // --- Productivity Stats ---
  getStats(): ProductivityStats {
    const allTasks = this.data.tasks.filter(t => !t.isArchived);
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === 'completed').length;
    const pendingTasks = allTasks.filter(t => t.status === 'todo').length;
    const inProgressTasks = allTasks.filter(t => t.status === 'in_progress' || t.status === 'review').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const priorityBreakdown: Record<TaskPriority, number> = {
      urgent: allTasks.filter(t => t.priority === 'urgent').length,
      high: allTasks.filter(t => t.priority === 'high').length,
      medium: allTasks.filter(t => t.priority === 'medium').length,
      low: allTasks.filter(t => t.priority === 'low').length,
    };

    const categoryBreakdown: Record<string, number> = {};
    for (const cat of this.data.categories) {
      categoryBreakdown[cat.id] = allTasks.filter(t => t.category === cat.id).length;
    }

    // Last 7 days completion tracking
    const last7Days: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = allTasks.filter(t => t.completedAt && t.completedAt.startsWith(dateStr)).length;
      last7Days.push({ date: dateStr, count });
    }

    // Calculate streak
    let currentStreak = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const hasCompleted = allTasks.some(t => t.completedAt && t.completedAt.startsWith(dateStr));
      if (hasCompleted) {
        currentStreak++;
      } else if (i > 0) {
        break; // Streak broken
      }
    }

    const totalTimeTrackedMinutes = allTasks.reduce((acc, t) => acc + (t.actualMinutes || 0), 0);

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      completionRate,
      currentStreakDays: Math.max(currentStreak, 1),
      longestStreakDays: Math.max(currentStreak, 7),
      priorityBreakdown,
      categoryBreakdown,
      tasksCompletedLast7Days: last7Days,
      totalTimeTrackedMinutes,
    };
  }

  // --- Activity Logs ---
  private logActivity(action: ActivityLog['action'], details: string, taskId?: string, taskTitle?: string) {
    const log: ActivityLog = {
      id: uuidv4(),
      taskId,
      taskTitle,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    this.data.activityLogs.unshift(log);
    // keep latest 100 logs
    if (this.data.activityLogs.length > 100) {
      this.data.activityLogs = this.data.activityLogs.slice(0, 100);
    }
  }

  getActivityLogs(limit = 20): ActivityLog[] {
    return this.data.activityLogs.slice(0, limit);
  }

  // --- Export & Import ---
  exportAllData() {
    return this.data;
  }

  importData(imported: Partial<DatabaseSchema>) {
    if (Array.isArray(imported.tasks)) {
      this.data.tasks = imported.tasks;
    }
    if (Array.isArray(imported.categories)) {
      this.data.categories = imported.categories;
    }
    this.save();
    return true;
  }
}

export const db = new Database();
