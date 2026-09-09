# ⚡ TaskFlow Pro — Modern Dynamic Fullstack Task Manager

A production-grade, highly responsive, modern fullstack dynamic Todo application built with industry-best UX inspired by Linear, Things 3, and Notion.

---

## 🌟 Key Features

### 1. 🎨 5 Dynamic Views
- **📋 List View**: Customizable grouping (by Status, Priority, Category, or Due Date) with smooth drag-and-drop reordering.
- **📊 Kanban Board View**: 4-column workflow (`To Do`, `In Progress`, `Under Review`, `Completed`) with instant drag-and-drop column transitions and column quick adds.
- **📅 Calendar View**: Monthly interactive schedule grid showing tasks on their due dates, with date-click scheduling.
- **🎯 Eisenhower Matrix**: 4-quadrant prioritization grid (`Do First`, `Schedule`, `Delegate / Quick`, `Eliminate / Backlog`).
- **📈 Productivity & Streak Dashboard**: 7-day velocity bar charts, daily completion streak counter, completion rate gauge, priority/category distribution, and live activity history logs.

### 2. ⚡ Power-User Experience (UX)
- **Global Command Palette (`Ctrl+K` / `Cmd+K`)**: Instant search and fast navigation between views, actions, and settings.
- **Natural Language Smart Input**: Type queries like:
  ```
  Deploy release candidate tomorrow at 4pm !urgent #devops @work ~45m
  ```
  The parser automatically extracts the title, due date, time, priority (`!urgent`), category (`@work`), tags (`#devops`), and estimated duration (`~45m`) with live token previews as you type.
- **Subtasks & Checklist**: Nested checklist steps per task with interactive progress bars (`2/3 done`).
- **🎯 Focus Pomodoro Timer**: 25m focus / 5m short break / 15m long break timer directly linked to tasks, automatically recording actual focus minutes to the task.
- **Batch Operations**: Multi-select tasks to batch complete, change priority, re-categorize, archive, or delete in one click.
- **Audio & Visual Delights**: Pure Web Audio synthesizer chimes/clicks (toggleable) + celebratory particle confetti animations on milestone completion.
- **Data Portability**: Full JSON backup export/import, CSV spreadsheet export, and Markdown checklist export.
- **Themes**: Dark, Midnight, Sunset, and Light modes with persistent preferences.
- **Real-Time Multi-Tab Sync**: Server-Sent Events (SSE) live updates keep all browser tabs synchronized instantly with zero refresh.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation

From the `fullstack-test` root directory:

```bash
# 1. Install all dependencies (root, backend, frontend)
npm run install:all
```

### Running Development Mode

To start both the Backend API server (Port 5000) and Frontend Vite Dev server (Port 5173) concurrently:

```bash
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## ⌨️ Keyboard Shortcuts Cheatsheet

| Shortcut | Description |
| :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Global Command Palette |
| `1` - `5` | Switch Views (1: List, 2: Board, 3: Calendar, 4: Matrix, 5: Analytics) |
| `N` | Create new task |
| `P` | Open Pomodoro focus timer |
| `Space` | Toggle task completion |
| `?` | Show keyboard shortcuts modal |
| `Esc` | Close dialogs / clear selection |

---

## 🏗️ Architecture & Stack

### Backend (`/backend`)
- **Runtime**: Node.js + Express + TypeScript
- **Database**: Persistent JSON/SQLite transactional store with atomic write safety
- **Real-Time**: Server-Sent Events (SSE) `/api/events`
- **NLP Service**: Regular expression token & relative date parser (`nlpParser.ts`)
- **API Endpoints**:
  - `GET /api/tasks` — Filtered & sorted task queries
  - `POST /api/tasks` — Task creation (smart natural language or standard)
  - `PUT /api/tasks/:id` — Full updates
  - `PATCH /api/tasks/:id/toggle` — Incomplete/Complete toggle
  - `PATCH /api/tasks/:id/status` — Kanban column drop
  - `PATCH /api/tasks/batch/reorder` — List drag-drop reordering
  - `POST /api/tasks/batch/action` — Bulk operations
  - `POST /api/tasks/:id/subtasks` — Add subtask
  - `GET /api/stats` — Productivity metrics & streaks
  - `GET /api/portability/export/(json|csv|markdown)` — Data export
  - `POST /api/portability/import` — JSON data import

### Frontend (`/frontend`)
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom theme extensions
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Animation & FX**: Canvas Confetti + Web Audio API synthesizer
