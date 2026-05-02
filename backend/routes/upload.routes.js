import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => res.json({ message: 'Upload routes placeholder' }));
export default router;
