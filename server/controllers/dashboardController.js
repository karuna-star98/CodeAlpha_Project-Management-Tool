import Project from '../models/Project.js';
import Task from '../models/Task.js';

export async function dashboard(req, res) {
  const projects = await Project.find({ memberIds: req.user._id }).select('_id name memberIds updatedAt').sort({ updatedAt: -1 });
  const projectIds = projects.map((project) => project._id);
  const [totalTasks, assignedTasks, byStatus, upcomingTasks] = await Promise.all([
    Task.countDocuments({ projectId: { $in: projectIds } }),
    Task.countDocuments({ projectId: { $in: projectIds }, assigneeId: req.user._id }),
    Task.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Task.find({ projectId: { $in: projectIds }, dueDate: { $ne: null }, status: { $ne: 'done' } })
      .populate('projectId', 'name')
      .sort({ dueDate: 1 })
      .limit(5)
  ]);

  const statusCounts = { todo: 0, 'in-progress': 0, done: 0 };
  byStatus.forEach((item) => { statusCounts[item._id] = item.count; });
  const progress = totalTasks ? Math.round((statusCounts.done / totalTasks) * 100) : 0;

  res.json({ projectCount: projects.length, totalTasks, assignedTasks, statusCounts, progress, upcomingTasks });
}
