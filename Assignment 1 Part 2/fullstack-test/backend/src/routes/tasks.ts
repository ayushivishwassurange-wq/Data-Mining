import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { eventManager } from '../services/events.js';
import { parseNaturalLanguageTask } from '../services/nlpParser.js';
import { TaskPriority, TaskStatus } from '../types/index.js';

const router = Router();

// GET /api/tasks (query filtering)
router.get('/', (req: Request, res: Response) => {
  try {
    const { status, priority, category, tag, search, isArchived, sortBy, sortOrder } = req.query;

    const tasks = db.getTasks({
      status: status as TaskStatus,
      priority: priority as TaskPriority,
      category: category as string,
      tag: tag as string,
      search: search as string,
      isArchived: isArchived !== undefined ? isArchived === 'true' : undefined,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
    });

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/tasks/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const task = db.getTaskById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tasks (smart natural language or standard input)
router.post('/', (req: Request, res: Response) => {
  try {
    const { title, smartInput } = req.body;
    let taskData = { ...req.body };

    // If smart input string is provided or title contains NLP markers
    if (smartInput || (title && (title.includes('!') || title.includes('@') || title.includes('#') || title.includes('~')))) {
      const parsed = parseNaturalLanguageTask(smartInput || title);
      taskData = {
        ...taskData,
        title: parsed.title,
        priority: taskData.priority || parsed.priority,
        category: taskData.category || parsed.category,
        tags: [...new Set([...(taskData.tags || []), ...parsed.tags])],
        dueDate: taskData.dueDate || parsed.dueDate,
        estimatedMinutes: taskData.estimatedMinutes || parsed.estimatedMinutes,
      };
    }

    const newTask = db.createTask(taskData);
    eventManager.broadcast('TASK_CREATED', newTask);

    res.status(201).json({ success: true, data: newTask });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/tasks/:id
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updated = db.updateTask(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    eventManager.broadcast('TASK_UPDATED', updated);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/tasks/:id/toggle
router.patch('/:id/toggle', (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updated = db.toggleTaskCompletion(id);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    eventManager.broadcast('TASK_UPDATED', updated);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/tasks/:id/status (for Kanban drag-drop)
router.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }
    const updated = db.updateTask(id, { status });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    eventManager.broadcast('TASK_UPDATED', updated);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/tasks/batch/reorder
router.patch('/batch/reorder', (req: Request, res: Response) => {
  try {
    const { taskIds } = req.body;
    if (!Array.isArray(taskIds)) {
      return res.status(400).json({ success: false, error: 'taskIds must be an array' });
    }
    const tasks = db.reorderTasks(taskIds);
    eventManager.broadcast('TASKS_REORDERED', { count: taskIds.length });
    res.json({ success: true, data: tasks });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tasks/batch/action (batch operations)
router.post('/batch/action', (req: Request, res: Response) => {
  try {
    const { action, taskIds, value } = req.body;
    if (!action || !Array.isArray(taskIds)) {
      return res.status(400).json({ success: false, error: 'action and taskIds array are required' });
    }
    const result = db.batchUpdate(action, taskIds, value);
    eventManager.broadcast('BATCH_UPDATED', { action, taskIds, value });
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const success = db.deleteTask(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    eventManager.broadcast('TASK_DELETED', { id });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Subtasks endpoints
router.post('/:id/subtasks', (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Subtask title is required' });
    }
    const subtask = db.addSubtask(id, title);
    if (!subtask) {
      return res.status(404).json({ success: false, error: 'Parent task not found' });
    }
    const parentTask = db.getTaskById(id);
    eventManager.broadcast('TASK_UPDATED', parentTask);
    res.status(201).json({ success: true, data: subtask });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/:id/subtasks/:subtaskId/toggle', (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const subtaskId = req.params.subtaskId as string;
    const subtask = db.toggleSubtask(id, subtaskId);
    if (!subtask) {
      return res.status(404).json({ success: false, error: 'Subtask or parent task not found' });
    }
    const parentTask = db.getTaskById(id);
    eventManager.broadcast('TASK_UPDATED', parentTask);
    res.json({ success: true, data: subtask });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id/subtasks/:subtaskId', (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const subtaskId = req.params.subtaskId as string;
    const success = db.deleteSubtask(id, subtaskId);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Subtask not found' });
    }
    const parentTask = db.getTaskById(id);
    eventManager.broadcast('TASK_UPDATED', parentTask);
    res.json({ success: true, message: 'Subtask deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
