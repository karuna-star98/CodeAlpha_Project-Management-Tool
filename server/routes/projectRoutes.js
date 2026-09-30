import { Router } from 'express';
import { addMember, createProject, deleteProject, getProject, listProjects, removeMember, updateProject } from '../controllers/projectController.js';
import { listTasks, createTask } from '../controllers/taskController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);
router.get('/', listProjects);
router.post('/', createProject);
router.get('/:projectId', getProject);
router.put('/:projectId', updateProject);
router.delete('/:projectId', deleteProject);
router.post('/:projectId/members', addMember);
router.delete('/:projectId/members/:userId', removeMember);
router.get('/:projectId/tasks', listTasks);
router.post('/:projectId/tasks', createTask);
export default router;
