import { Router } from 'express';
import { getBookings, createBooking, updateBookingStatus } from '../controllers/bookingController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getBookings);
router.post('/', authenticate, createBooking);
router.put('/:id', authenticate, adminOnly, updateBookingStatus);

export default router;
