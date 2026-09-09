import { TaskPriority } from '../types/index.js';

export interface ParsedTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  category?: string;
  tags: string[];
  dueDate?: string | null;
  estimatedMinutes?: number | null;
}

export function parseNaturalLanguageTask(rawInput: string): ParsedTaskInput {
  let title = rawInput.trim();
  let priority: TaskPriority | undefined;
  let category: string | undefined;
  const tags: string[] = [];
  let dueDate: string | null = null;
  let estimatedMinutes: number | null = null;

  // 1. Priority matcher: !urgent, !high, !medium, !low, !p1, !p2, !p3, !p4
  const priorityMatch = title.match(/!(urgent|high|medium|low|p1|p2|p3|p4)\b/i);
  if (priorityMatch) {
    const p = priorityMatch[1].toLowerCase();
    if (p === 'urgent' || p === 'p1') priority = 'urgent';
    else if (p === 'high' || p === 'p2') priority = 'high';
    else if (p === 'medium' || p === 'p3') priority = 'medium';
    else if (p === 'low' || p === 'p4') priority = 'low';
    title = title.replace(priorityMatch[0], '').trim();
  }

  // 2. Category matcher: @work, @personal, @study, @health, @finance, etc.
  const categoryMatch = title.match(/@([a-zA-Z0-9_-]+)/);
  if (categoryMatch) {
    category = categoryMatch[1].toLowerCase();
    title = title.replace(categoryMatch[0], '').trim();
  }

  // 3. Tags matcher: #frontend #bug #urgent
  const tagMatches = title.matchAll(/#([a-zA-Z0-9_-]+)/g);
  for (const match of tagMatches) {
    tags.push(match[1].toLowerCase());
    title = title.replace(match[0], '').trim();
  }

  // 4. Estimate matcher: ~30m, ~2h, ~90mins
  const estMatch = title.match(/~(\d+)(m|h|mins|hours?)\b/i);
  if (estMatch) {
    const val = parseInt(estMatch[1], 10);
    const unit = estMatch[2].toLowerCase();
    if (unit.startsWith('h')) {
      estimatedMinutes = val * 60;
    } else {
      estimatedMinutes = val;
    }
    title = title.replace(estMatch[0], '').trim();
  }

  // 5. Smart Date & Time parser
  const now = new Date();
  
  // Check for time of day: at 3pm, at 15:30, at 9am
  let hours = 18; // default to 6:00 PM if date mentioned without time
  let minutes = 0;
  const timeMatch = title.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
  if (timeMatch) {
    let h = parseInt(timeMatch[1], 10);
    const m = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const meridiem = timeMatch[3]?.toLowerCase();
    if (meridiem === 'pm' && h < 12) h += 12;
    if (meridiem === 'am' && h === 12) h = 0;
    hours = h;
    minutes = m;
    title = title.replace(timeMatch[0], '').trim();
  }

  // Date phrases
  const lower = title.toLowerCase();
  const todayMatch = lower.match(/\b(today|tonight)\b/i);
  const tomorrowMatch = lower.match(/\b(tomorrow|tmrw)\b/i);
  const nextWeekMatch = lower.match(/\bnext\s+(week|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  const inDaysMatch = lower.match(/\bin\s+(\d+)\s+days?\b/i);

  if (todayMatch) {
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    dueDate = d.toISOString();
    title = title.replace(new RegExp(`\\b${todayMatch[1]}\\b`, 'gi'), '').trim();
  } else if (tomorrowMatch) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(hours, minutes, 0, 0);
    dueDate = d.toISOString();
    title = title.replace(new RegExp(`\\b${tomorrowMatch[1]}\\b`, 'gi'), '').trim();
  } else if (inDaysMatch) {
    const daysToAdd = parseInt(inDaysMatch[1], 10);
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    d.setHours(hours, minutes, 0, 0);
    dueDate = d.toISOString();
    title = title.replace(inDaysMatch[0], '').trim();
  } else if (nextWeekMatch) {
    const targetDay = nextWeekMatch[1].toLowerCase();
    const d = new Date();
    if (targetDay === 'week') {
      d.setDate(d.getDate() + 7);
    } else {
      const dayMap: Record<string, number> = {
        sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
        thursday: 4, friday: 5, saturday: 6
      };
      const desiredDay = dayMap[targetDay];
      const currentDay = d.getDay();
      let diff = desiredDay - currentDay;
      if (diff <= 0) diff += 7;
      d.setDate(d.getDate() + diff);
    }
    d.setHours(hours, minutes, 0, 0);
    dueDate = d.toISOString();
    title = title.replace(nextWeekMatch[0], '').trim();
  }

  // Clean up any remaining trailing punctuation / whitespace
  title = title.replace(/^[-–—:\s]+|[-–—:\s]+$/g, '').trim();

  return {
    title: title || rawInput.trim(),
    priority,
    category,
    tags,
    dueDate,
    estimatedMinutes
  };
}
