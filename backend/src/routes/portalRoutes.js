import { Router } from 'express';
import {
  getPortalSummary,
  getPortalProfile,
  updatePortalProfile,
  getPortalDocuments,
  createPortalDocument,
  getSupportTickets,
  createSupportTicket,
  updateSupportTicket,
} from '../controllers/portalController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/summary', getPortalSummary);
router.get('/profile', getPortalProfile);
router.put('/profile', updatePortalProfile);
router.get('/documents', getPortalDocuments);
router.post('/documents', createPortalDocument);
router.get('/support', getSupportTickets);
router.post('/support', createSupportTicket);
router.put('/support/:id', adminOnly, updateSupportTicket);

export default router;
