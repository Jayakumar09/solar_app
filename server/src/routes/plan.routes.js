const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const planController = require('../controllers/plan.controller');

router.get('/', planController.getPlans);
router.get('/:id', planController.getPlanById);

router.post('/', adminMiddleware, planController.createPlan);
router.put('/:id', adminMiddleware, planController.updatePlan);
router.delete('/:id', adminMiddleware, planController.deletePlan);

module.exports = router;
