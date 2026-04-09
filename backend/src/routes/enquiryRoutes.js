import { Router } from 'express';
import { getAllEnquiries, createEnquiry } from '../controllers/enquiryController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getAllEnquiries);
router.post('/', authenticate, createEnquiry);

export default router;
