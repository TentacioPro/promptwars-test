import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as aiController from '../controllers/ai.controller.js';

const router = Router();

router.use(authenticate);

router.post('/suggest-assignee', aiController.suggestAssignee);
router.get('/standup/:teamId', aiController.generateStandup);
// Burnout & Forecaster can be added here as we expand

export default router;
