import { Router } from 'express';
import { createContactEnquiry, getContactEnquiries, updateContactStatus, replyContactEnquiry } from '../controllers/contactController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/', createContactEnquiry);
router.get('/', authenticate, adminOnly, getContactEnquiries);
router.put('/:id', authenticate, adminOnly, updateContactStatus);
router.post('/:id/reply', authenticate, adminOnly, replyContactEnquiry);

export default router;
