const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stats', adminController.getStats);
router.get('/stats/monthly', adminController.getMonthlyStats);
router.get('/stats/leads-by-status', adminController.getLeadsByStatus);

module.exports = router;
