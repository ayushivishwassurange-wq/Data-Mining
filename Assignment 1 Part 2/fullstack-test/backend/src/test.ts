import { db } from './db/database.js';
import { parseNaturalLanguageTask } from './services/nlpParser.js';
import assert from 'assert';

console.log('🧪 Starting TaskFlow Pro automated backend tests...');

// 1. Test Natural Language Parser
console.log('1️⃣ Testing Natural Language Smart Parser...');
const parsed = parseNaturalLanguageTask('Deploy release candidate tomorrow at 4pm !urgent #devops #release @work ~45m');
assert.strictEqual(parsed.title, 'Deploy release candidate');
assert.strictEqual(parsed.priority, 'urgent');
assert.strictEqual(parsed.category, 'work');
assert.deepStrictEqual(parsed.tags, ['devops', 'release']);
assert.strictEqual(parsed.estimatedMinutes, 45);
assert.ok(parsed.dueDate !== null, 'Due date should be parsed');
console.log('  ✅ Natural Language Parser passed!');

// 2. Test Database Tasks CRUD
console.log('2️⃣ Testing Database Task CRUD...');
const initialTasks = db.getTasks();
assert.ok(initialTasks.length > 0, 'Database should contain initial seed tasks');

const newTask = db.createTask({
  title: 'Automated Test Task',
  description: 'Testing task creation',
  priority: 'high',
  category: 'work',
  tags: ['test', 'ci'],
});
assert.ok(newTask.id, 'Created task must have an ID');
assert.strictEqual(newTask.title, 'Automated Test Task');
assert.strictEqual(newTask.status, 'todo');

// Toggle completion
const toggled = db.toggleTaskCompletion(newTask.id);
assert.strictEqual(toggled?.status, 'completed');
assert.ok(toggled?.completedAt !== null);

const toggledBack = db.toggleTaskCompletion(newTask.id);
assert.strictEqual(toggledBack?.status, 'todo');
assert.strictEqual(toggledBack?.completedAt, null);
console.log('  ✅ Task CRUD and Toggle passed!');

// 3. Test Subtasks
console.log('3️⃣ Testing Subtasks...');
const subtask = db.addSubtask(newTask.id, 'Subtask 1: Write assertions');
assert.ok(subtask?.id);
assert.strictEqual(subtask?.completed, false);

const toggledSubtask = db.toggleSubtask(newTask.id, subtask!.id);
assert.strictEqual(toggledSubtask?.completed, true);
console.log('  ✅ Subtasks operations passed!');

// 4. Test Batch Actions
console.log('4️⃣ Testing Batch Operations...');
const batchRes = db.batchUpdate('set_priority', [newTask.id], 'urgent');
assert.strictEqual(batchRes.modifiedCount, 1);
const updatedTask = db.getTaskById(newTask.id);
assert.strictEqual(updatedTask?.priority, 'urgent');
console.log('  ✅ Batch operations passed!');

// 5. Test Productivity Stats
console.log('5️⃣ Testing Productivity Stats Engine...');
const stats = db.getStats();
assert.ok(stats.totalTasks > 0);
assert.ok(typeof stats.completionRate === 'number');
assert.ok(stats.tasksCompletedLast7Days.length === 7);
console.log('  ✅ Stats engine passed!');

// 6. Clean up created test task
db.deleteTask(newTask.id);
assert.strictEqual(db.getTaskById(newTask.id), undefined);
console.log('  ✅ Task deletion passed!');

console.log('🎉 All automated tests passed successfully!');
