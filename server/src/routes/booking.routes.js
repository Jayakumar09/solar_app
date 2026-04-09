const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const bookingController = require('../controllers/booking.controller');

router.post('/', authMiddleware, [
  body('serviceType').trim().notEmpty(),
  body('scheduledDate').isISO8601()
], bookingController.createBooking);

router.get('/', bookingController.getBookings);
router.get('/my-bookings', authMiddleware, bookingController.getCustomerBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id', adminMiddleware, bookingController.updateBooking);

module.exports = router;
