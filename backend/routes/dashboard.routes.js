import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => res.json({ message: 'Dashboard routes placeholder' }));
export default router;
