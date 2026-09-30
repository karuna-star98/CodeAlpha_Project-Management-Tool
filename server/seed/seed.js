import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Comment from '../models/Comment.js';

await connectDB();
await Promise.all([
  Comment.deleteMany({}),
  Task.deleteMany({}),
  Project.deleteMany({}),
  User.deleteMany({ email: { $in: ['owner@example.com', 'member@example.com'] } })
]);

const passwordHash = await bcrypt.hash('Password123!', 12);
const [owner, member] = await User.create([
  { name: 'Asha Sharma', email: 'owner@example.com', passwordHash, role: 'admin' },
  { name: 'Rohan Patil', email: 'member@example.com', passwordHash }
]);

const project = await Project.create({
  name: 'CodeAlpha Internship Tool',
  description: 'Demo project for the Project Management Tool internship task.',
  ownerId: owner._id,
  memberIds: [owner._id, member._id]
});

const [design, api, readme] = await Task.create([
  { projectId: project._id, title: 'Design project board', description: 'Finalize the Kanban columns and task card layout.', createdBy: owner._id, assigneeId: member._id, status: 'done', priority: 'high', dueDate: new Date(Date.now() + 86400000) },
  { projectId: project._id, title: 'Implement REST API', description: 'Complete protected project and task endpoints.', createdBy: owner._id, assigneeId: owner._id, status: 'in-progress', priority: 'high', dueDate: new Date(Date.now() + 3 * 86400000) },
  { projectId: project._id, title: 'Write README', description: 'Document setup, environment variables, API endpoints, testing and screenshots.', createdBy: member._id, assigneeId: member._id, status: 'todo', priority: 'medium', dueDate: new Date(Date.now() + 5 * 86400000) }
]);

await Comment.create({ taskId: api._id, userId: member._id, text: 'I will verify the protected routes after the API endpoints are wired.' });
await Comment.create({ taskId: design._id, userId: owner._id, text: 'Board structure is ready for the demo flow.' });

console.log('\nSeed complete.\nOwner: owner@example.com / Password123!\nMember: member@example.com / Password123!\n');
await mongoose.connection.close();
