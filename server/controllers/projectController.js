import Project from '../models/Project.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Comment from '../models/Comment.js';
import { requireOwner, requireProjectMember } from '../services/projectAccess.js';

function clean(value) {
  return typeof value === 'string' ? value.trim() : value;
}

export async function listProjects(req, res) {
  const projects = await Project.find({ memberIds: req.user._id })
    .populate('ownerId', 'name email')
    .populate('memberIds', 'name email')
    .sort({ updatedAt: -1 });
  const enriched = await Promise.all(projects.map(async (project) => {
    const [taskCount, completedTaskCount] = await Promise.all([
      Task.countDocuments({ projectId: project._id }),
      Task.countDocuments({ projectId: project._id, status: 'done' })
    ]);
    return { ...project.toObject(), taskCount, completedTaskCount };
  }));
  res.json(enriched);
}

export async function createProject(req, res) {
  const name = clean(req.body.name);
  const description = clean(req.body.description) || '';
  if (!name || name.length < 2) return res.status(400).json({ message: 'Project name is required.' });

  const project = await Project.create({ name, description, ownerId: req.user._id, memberIds: [req.user._id] });
  const full = await Project.findById(project._id)
    .populate('ownerId', 'name email')
    .populate('memberIds', 'name email');
  res.status(201).json(full);
}

export async function getProject(req, res) {
  const project = await requireProjectMember(req.params.projectId, req.user._id);
  const full = await Project.findById(project._id)
    .populate('ownerId', 'name email')
    .populate('memberIds', 'name email');
  res.json(full);
}

export async function updateProject(req, res) {
  const project = await requireProjectMember(req.params.projectId, req.user._id);
  requireOwner(project, req.user._id);

  if (req.body.name !== undefined) project.name = clean(req.body.name);
  if (req.body.description !== undefined) project.description = clean(req.body.description) || '';
  if (!project.name || project.name.length < 2) return res.status(400).json({ message: 'Project name is required.' });

  await project.save();
  const full = await Project.findById(project._id).populate('ownerId', 'name email').populate('memberIds', 'name email');
  res.json(full);
}

export async function deleteProject(req, res) {
  const project = await requireProjectMember(req.params.projectId, req.user._id);
  requireOwner(project, req.user._id);
  const taskIds = await Task.find({ projectId: project._id }).distinct('_id');
  await Comment.deleteMany({ taskId: { $in: taskIds } });
  await Task.deleteMany({ projectId: project._id });
  await project.deleteOne();
  res.json({ message: 'Project deleted.' });
}

export async function addMember(req, res) {
  const project = await requireProjectMember(req.params.projectId, req.user._id);
  requireOwner(project, req.user._id);

  const email = String(req.body.email || '').trim().toLowerCase();
  const member = await User.findOne({ email });
  if (!member) return res.status(404).json({ message: 'No user found with that email.' });
  if (project.memberIds.some((id) => String(id) === String(member._id))) {
    return res.status(409).json({ message: 'That user is already a project member.' });
  }

  project.memberIds.push(member._id);
  await project.save();
  const full = await Project.findById(project._id).populate('ownerId', 'name email').populate('memberIds', 'name email');
  res.json(full);
}

export async function removeMember(req, res) {
  const project = await requireProjectMember(req.params.projectId, req.user._id);
  requireOwner(project, req.user._id);
  if (String(project.ownerId) === String(req.params.userId)) {
    return res.status(400).json({ message: 'The project owner cannot be removed.' });
  }

  project.memberIds = project.memberIds.filter((id) => String(id) !== String(req.params.userId));
  await project.save();
  await Task.updateMany({ projectId: project._id, assigneeId: req.params.userId }, { $set: { assigneeId: null } });
  const full = await Project.findById(project._id).populate('ownerId', 'name email').populate('memberIds', 'name email');
  res.json(full);
}
