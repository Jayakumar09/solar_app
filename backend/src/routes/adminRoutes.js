import { Router } from 'express';
import { getDashboardStats, getAllUsers } from '../controllers/adminController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', authenticate, adminOnly, getDashboardStats);
router.get('/users', authenticate, adminOnly, getAllUsers);

export default router;
