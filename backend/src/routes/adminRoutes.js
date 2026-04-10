import { Router } from 'express';
import { getDashboardStats, getAllUsers, createUser, updateUser, deleteUser } from '../controllers/adminController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', authenticate, adminOnly, getDashboardStats);
router.get('/users', authenticate, adminOnly, getAllUsers);
router.post('/users', authenticate, adminOnly, createUser);
router.put('/users/:id', authenticate, adminOnly, updateUser);
router.delete('/users/:id', authenticate, adminOnly, deleteUser);

export default router;
