import Task from '../models/Task.js';
import Comment from '../models/Comment.js';
import { requireProjectMember } from '../services/projectAccess.js';

const statuses = ['todo', 'in-progress', 'done'];
const priorities = ['low', 'medium', 'high'];

function normalizeDueDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

async function withPopulates(query) {
  return query.populate('assigneeId', 'name email').populate('createdBy', 'name email');
}

export async function listTasks(req, res) {
  await requireProjectMember(req.params.projectId, req.user._id);
  const tasks = await withPopulates(
    Task.find({ projectId: req.params.projectId }).sort({ createdAt: -1 })
  );
  res.json(tasks);
}

export async function createTask(req, res) {
  const project = await requireProjectMember(req.params.projectId, req.user._id);
  const title = String(req.body.title || '').trim();
  if (title.length < 2) return res.status(400).json({ message: 'Task title is required.' });

  const status = req.body.status || 'todo';
  const priority = req.body.priority || 'medium';
  if (!statuses.includes(status)) return res.status(400).json({ message: 'Invalid task status.' });
  if (!priorities.includes(priority)) return res.status(400).json({ message: 'Invalid task priority.' });

  let dueDate = null;
  if (req.body.dueDate) {
    dueDate = normalizeDueDate(req.body.dueDate);
    if (dueDate === undefined) return res.status(400).json({ message: 'Invalid due date.' });
  }

  let assigneeId = null;
  if (req.body.assigneeId) {
    const isMember = project.memberIds.some((id) => String(id) === String(req.body.assigneeId));
    if (!isMember) return res.status(400).json({ message: 'Assignee must be a project member.' });
    assigneeId = req.body.assigneeId;
  }

  const task = await Task.create({
    projectId: project._id,
    title,
    description: String(req.body.description || '').trim(),
    assigneeId,
    createdBy: req.user._id,
    status,
    priority,
    dueDate
  });

  res.status(201).json(await withPopulates(Task.findById(task._id)));
}

export async function getTask(req, res) {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  await requireProjectMember(task.projectId, req.user._id);
  res.json(await withPopulates(Task.findById(task._id)));
}

export async function updateTask(req, res) {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  const project = await requireProjectMember(task.projectId, req.user._id);

  if (req.body.title !== undefined) {
    const title = String(req.body.title).trim();
    if (title.length < 2) return res.status(400).json({ message: 'Task title is required.' });
    task.title = title;
  }
  if (req.body.description !== undefined) task.description = String(req.body.description).trim();
  if (req.body.status !== undefined) {
    if (!statuses.includes(req.body.status)) return res.status(400).json({ message: 'Invalid task status.' });
    task.status = req.body.status;
  }
  if (req.body.priority !== undefined) {
    if (!priorities.includes(req.body.priority)) return res.status(400).json({ message: 'Invalid task priority.' });
    task.priority = req.body.priority;
  }
  if (req.body.dueDate !== undefined) {
    const dueDate = normalizeDueDate(req.body.dueDate);
    if (req.body.dueDate && dueDate === undefined) return res.status(400).json({ message: 'Invalid due date.' });
    task.dueDate = dueDate;
  }
  if (req.body.assigneeId !== undefined) {
    if (!req.body.assigneeId) task.assigneeId = null;
    else {
      const isMember = project.memberIds.some((id) => String(id) === String(req.body.assigneeId));
      if (!isMember) return res.status(400).json({ message: 'Assignee must be a project member.' });
      task.assigneeId = req.body.assigneeId;
    }
  }

  await task.save();
  res.json(await withPopulates(Task.findById(task._id)));
}

export async function deleteTask(req, res) {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  const project = await requireProjectMember(task.projectId, req.user._id);
  const isOwner = String(project.ownerId) === String(req.user._id);
  const isCreator = String(task.createdBy) === String(req.user._id);
  if (!isOwner && !isCreator) return res.status(403).json({ message: 'Only the project owner or task creator can delete this task.' });
  await Comment.deleteMany({ taskId: task._id });
  await task.deleteOne();
  res.json({ message: 'Task deleted.' });
}

export async function changeStatus(req, res) {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  await requireProjectMember(task.projectId, req.user._id);
  if (!statuses.includes(req.body.status)) return res.status(400).json({ message: 'Invalid task status.' });
  task.status = req.body.status;
  await task.save();
  res.json(await withPopulates(Task.findById(task._id)));
}

export async function changeAssignee(req, res) {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  const project = await requireProjectMember(task.projectId, req.user._id);
  if (req.body.assigneeId) {
    const isMember = project.memberIds.some((id) => String(id) === String(req.body.assigneeId));
    if (!isMember) return res.status(400).json({ message: 'Assignee must be a project member.' });
  }
  task.assigneeId = req.body.assigneeId || null;
  await task.save();
  res.json(await withPopulates(Task.findById(task._id)));
}
