import { Router } from 'express';
import { getPlans, getPlanById, createPlan } from '../controllers/planController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getPlans);
router.get('/:id', getPlanById);
router.post('/', authenticate, adminOnly, createPlan);

export default router;
