import Comment from '../models/Comment.js';
import Task from '../models/Task.js';
import { requireProjectMember } from '../services/projectAccess.js';

export async function listComments(req, res) {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  await requireProjectMember(task.projectId, req.user._id);
  const comments = await Comment.find({ taskId: task._id }).populate('userId', 'name email').sort({ createdAt: 1 });
  res.json(comments);
}

export async function createComment(req, res) {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  await requireProjectMember(task.projectId, req.user._id);
  const text = String(req.body.text || '').trim();
  if (!text) return res.status(400).json({ message: 'Comment cannot be empty.' });
  const comment = await Comment.create({ taskId: task._id, userId: req.user._id, text });
  res.status(201).json(await Comment.findById(comment._id).populate('userId', 'name email'));
}

export async function deleteComment(req, res) {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return res.status(404).json({ message: 'Comment not found.' });
  const task = await Task.findById(comment.taskId);
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  const project = await requireProjectMember(task.projectId, req.user._id);
  const canDelete = String(comment.userId) === String(req.user._id) || String(project.ownerId) === String(req.user._id);
  if (!canDelete) return res.status(403).json({ message: 'You cannot delete this comment.' });
  await comment.deleteOne();
  res.json({ message: 'Comment deleted.' });
}
