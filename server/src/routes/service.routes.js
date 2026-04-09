const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const serviceController = require('../controllers/service.controller');

router.post('/', authMiddleware, serviceController.createServiceRequest);

router.get('/', authMiddleware, serviceController.getServiceRequests);
router.get('/my-requests', authMiddleware, serviceController.getCustomerServiceRequests);
router.get('/:id', authMiddleware, serviceController.getServiceRequestById);
router.put('/:id', authMiddleware, serviceController.updateServiceRequest);

module.exports = router;
