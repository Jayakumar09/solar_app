import { Router } from 'express';
import { getLeads, getLeadById, updateLeadStatus, createLead } from '../controllers/leadController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, adminOnly, getLeads);
router.get('/:id', authenticate, adminOnly, getLeadById);
router.put('/:id', authenticate, adminOnly, updateLeadStatus);
router.post('/', createLead);

export default router;
