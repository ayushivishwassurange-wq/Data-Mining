import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { eventManager } from '../services/events.js';

const router = Router();

// GET /api/portability/export/json
router.get('/export/json', (_req: Request, res: Response) => {
  try {
    const data = db.exportAllData();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=tasks_backup_${Date.now()}.json`);
    res.send(JSON.stringify(data, null, 2));
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/portability/export/csv
router.get('/export/csv', (_req: Request, res: Response) => {
  try {
    const tasks = db.getTasks();
    const headers = ['ID', 'Title', 'Status', 'Priority', 'Category', 'Due Date', 'Tags', 'Created At', 'Completed At'];
    const rows = tasks.map(t => [
      `"${t.id}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.status}"`,
      `"${t.priority}"`,
      `"${t.category}"`,
      `"${t.dueDate || ''}"`,
      `"${t.tags.join(', ')}"`,
      `"${t.createdAt}"`,
      `"${t.completedAt || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=tasks_export_${Date.now()}.csv`);
    res.send(csvContent);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/portability/export/markdown
router.get('/export/markdown', (_req: Request, res: Response) => {
  try {
    const tasks = db.getTasks();
    let md = `# TaskFlow Pro Export — ${new Date().toLocaleDateString()}\n\n`;
    
    const pending = tasks.filter(t => t.status !== 'completed');
    const done = tasks.filter(t => t.status === 'completed');

    md += `## 📋 Pending Tasks (${pending.length})\n\n`;
    for (const t of pending) {
      const priorityBadge = `[${t.priority.toUpperCase()}]`;
      const dueBadge = t.dueDate ? `(Due: ${new Date(t.dueDate).toLocaleDateString()})` : '';
      const tags = t.tags.length ? ` ${t.tags.map(tag => `#${tag}`).join(' ')}` : '';
      md += `- [ ] **${t.title}** ${priorityBadge} ${dueBadge}${tags}\n`;
      if (t.description) md += `  > ${t.description}\n`;
      for (const st of t.subtasks) {
        md += `  - [${st.completed ? 'x' : ' '}] ${st.title}\n`;
      }
    }

    md += `\n## ✅ Completed Tasks (${done.length})\n\n`;
    for (const t of done) {
      md += `- [x] ~${t.title}~\n`;
    }

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename=tasks_export_${Date.now()}.md`);
    res.send(md);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/portability/import
router.post('/import', (req: Request, res: Response) => {
  try {
    const importedData = req.body;
    if (!importedData || (!importedData.tasks && !Array.isArray(importedData))) {
      return res.status(400).json({ success: false, error: 'Invalid import JSON structure' });
    }

    const payload = Array.isArray(importedData) ? { tasks: importedData } : importedData;
    db.importData(payload);
    eventManager.broadcast('DATA_IMPORTED', { count: payload.tasks?.length || 0 });

    res.json({ success: true, message: 'Data imported successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
