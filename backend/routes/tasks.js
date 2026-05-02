import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema, statusSchema, commentSchema } from '../schemas/task.schema.js';
import * as taskController from '../controllers/task.controller.js';

const router = Router();

// Apply authentication middleware to all task routes
router.use(authenticate);

router.get('/', taskController.listTasks);
router.get('/:id', taskController.getTask);
router.post('/', validate(createTaskSchema), taskController.createTask);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/status', validate(statusSchema), taskController.updateStatus);
router.post('/:id/comments', validate(commentSchema), taskController.addComment);

export default router;
