const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const monitoringController = require('../controllers/monitoring.controller');

router.get('/data', authMiddleware, monitoringController.getMonitoringData);
router.get('/live', authMiddleware, monitoringController.getLiveData);
router.get('/historical', authMiddleware, monitoringController.getHistoricalData);

module.exports = router;
