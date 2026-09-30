import { Router } from 'express';
import { changeAssignee, changeStatus, deleteTask, getTask, updateTask } from '../controllers/taskController.js';
import { createComment, deleteComment, listComments } from '../controllers/commentController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);
router.get('/:taskId', getTask);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);
router.patch('/:taskId/status', changeStatus);
router.patch('/:taskId/assignee', changeAssignee);
router.get('/:taskId/comments', listComments);
router.post('/:taskId/comments', createComment);
export default router;
