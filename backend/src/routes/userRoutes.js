import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getProfile } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], login);

router.get('/profile', authenticate, getProfile);

export default router;
