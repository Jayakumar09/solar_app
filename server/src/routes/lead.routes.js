const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const leadController = require('../controllers/lead.controller');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');

router.post('/', [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone('en-IN'),
  body('serviceType').optional().trim()
], validate, leadController.createLead);

router.get('/', leadController.getLeads);
router.get('/my-leads', authMiddleware, adminMiddleware, leadController.getMyLeads);
router.get('/:id', leadController.getLeadById);
router.put('/:id', adminMiddleware, leadController.updateLead);
router.delete('/:id', adminMiddleware, leadController.deleteLead);

module.exports = router;
