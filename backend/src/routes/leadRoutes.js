import { Router } from 'express';
import { body } from 'express-validator';
import { getLeads, getLeadById, updateLeadStatus, createLead } from '../controllers/leadController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

const leadValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
];

router.get('/', authenticate, adminOnly, getLeads);
router.get('/:id', authenticate, adminOnly, getLeadById);
router.put('/:id', authenticate, adminOnly, updateLeadStatus);
router.post('/', leadValidation, createLead);

export default router;
