import Project from '../models/Project.js';
import mongoose from 'mongoose';

export async function getProjectForMember(projectId, userId) {
  if (!mongoose.isValidObjectId(projectId)) return null;
  return Project.findOne({ _id: projectId, memberIds: userId });
}

export async function requireProjectMember(projectId, userId) {
  const project = await getProjectForMember(projectId, userId);
  if (!project) {
    const err = new Error('You are not a member of this project.');
    err.status = 403;
    throw err;
  }
  return project;
}

export function requireOwner(project, userId) {
  if (String(project.ownerId) !== String(userId)) {
    const err = new Error('Only the project owner can perform this action.');
    err.status = 403;
    throw err;
  }
}
