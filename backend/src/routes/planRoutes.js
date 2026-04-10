import { Router } from 'express';
import { getPlans, getPlanById, createPlan, updatePlan, deletePlan } from '../controllers/planController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getPlans);
router.get('/:id', getPlanById);
router.post('/', authenticate, adminOnly, createPlan);
router.put('/:id', authenticate, adminOnly, updatePlan);
router.delete('/:id', authenticate, adminOnly, deletePlan);

export default router;
