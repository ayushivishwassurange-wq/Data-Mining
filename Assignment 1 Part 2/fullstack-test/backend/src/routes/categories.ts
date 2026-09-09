import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { eventManager } from '../services/events.js';

const router = Router();

// GET /api/categories
router.get('/', (req: Request, res: Response) => {
  try {
    const categories = db.getCategories();
    res.json({ success: true, data: categories });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/categories
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, color, icon } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Category name is required' });
    }
    const category = db.createCategory({ name, color, icon });
    eventManager.broadcast('CATEGORY_CREATED', category);
    res.status(201).json({ success: true, data: category });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
