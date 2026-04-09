import { Router } from 'express';
import { getServiceRequests, createServiceRequest, updateServiceStatus } from '../controllers/serviceController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getServiceRequests);
router.post('/', authenticate, createServiceRequest);
router.put('/:id', authenticate, adminOnly, updateServiceStatus);

export default router;
