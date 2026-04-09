import { Router } from 'express';
import { createContactEnquiry, getContactEnquiries } from '../controllers/contactController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/', createContactEnquiry);
router.get('/', authenticate, adminOnly, getContactEnquiries);

export default router;
