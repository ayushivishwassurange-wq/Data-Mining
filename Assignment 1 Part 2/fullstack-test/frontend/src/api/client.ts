import { Task, Category, ProductivityStats, ActivityLog } from '../types';

const API_BASE = '/api';

export const api = {
  // Tasks
  async getTasks(params?: Record<string, any>): Promise<{ success: boolean; data: Task[] }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== 'all' && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    const res = await fetch(`${API_BASE}/tasks?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async createTask(data: Partial<Task> & { smartInput?: string }): Promise<{ success: boolean; data: Task }> {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<{ success: boolean; data: Task }> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  async toggleTask(id: string): Promise<{ success: boolean; data: Task }> {
    const res = await fetch(`${API_BASE}/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to toggle task');
    return res.json();
  },

  async updateTaskStatus(id: string, status: string): Promise<{ success: boolean; data: Task }> {
    const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  async reorderTasks(taskIds: string[]): Promise<{ success: boolean; data: Task[] }> {
    const res = await fetch(`${API_BASE}/tasks/batch/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskIds }),
    });
    if (!res.ok) throw new Error('Failed to reorder tasks');
    return res.json();
  },

  async batchAction(action: string, taskIds: string[], value?: string): Promise<{ success: boolean; data: any }> {
    const res = await fetch(`${API_BASE}/tasks/batch/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, taskIds, value }),
    });
    if (!res.ok) throw new Error('Failed to execute batch action');
    return res.json();
  },

  async deleteTask(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return res.json();
  },

  // Subtasks
  async addSubtask(taskId: string, title: string) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to add subtask');
    return res.json();
  },

  async toggleSubtask(taskId: string, subtaskId: string) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}/toggle`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to toggle subtask');
    return res.json();
  },

  async deleteSubtask(taskId: string, subtaskId: string) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete subtask');
    return res.json();
  },

  // Categories
  async getCategories(): Promise<{ success: boolean; data: Category[] }> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async createCategory(cat: Omit<Category, 'id'>): Promise<{ success: boolean; data: Category }> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },

  // Stats & Activity
  async getStats(): Promise<{ success: boolean; data: ProductivityStats }> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async getActivity(limit = 15): Promise<{ success: boolean; data: ActivityLog[] }> {
    const res = await fetch(`${API_BASE}/stats/activity?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch activity');
    return res.json();
  },

  // Import / Export URLs
  getExportJsonUrl: () => `${API_BASE}/portability/export/json`,
  getExportCsvUrl: () => `${API_BASE}/portability/export/csv`,
  getExportMarkdownUrl: () => `${API_BASE}/portability/export/markdown`,

  async importData(data: any): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/portability/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to import data');
    return res.json();
  },

  // SSE Subscriber
  subscribeToEvents(onEvent: (event: { type: string; payload: any }) => void): () => void {
    let evtSource: EventSource | null = null;
    let reconnectTimeout: any = null;

    const connect = () => {
      evtSource = new EventSource(`${API_BASE}/events`);

      evtSource.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          onEvent(parsed);
        } catch (err) {
          console.error('Failed to parse SSE message:', err);
        }
      };

      evtSource.onerror = () => {
        if (evtSource) {
          evtSource.close();
        }
        // Auto-reconnect after 3 seconds
        reconnectTimeout = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (evtSource) evtSource.close();
    };
  },
};
