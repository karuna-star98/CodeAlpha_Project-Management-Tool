import { Router } from 'express';
import { deleteComment } from '../controllers/commentController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);
router.delete('/:commentId', deleteComment);
export default router;
