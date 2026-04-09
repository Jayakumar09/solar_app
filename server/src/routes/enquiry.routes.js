const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { adminMiddleware, authMiddleware } = require('../middleware/auth.middleware');
const enquiryController = require('../controllers/enquiry.controller');

router.post('/', [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().notEmpty()
], validate, enquiryController.createEnquiry);

router.get('/', authMiddleware, adminMiddleware, enquiryController.getEnquiries);
router.get('/:id', authMiddleware, adminMiddleware, enquiryController.getEnquiryById);
router.put('/:id', adminMiddleware, enquiryController.updateEnquiry);
router.delete('/:id', adminMiddleware, enquiryController.deleteEnquiry);

module.exports = router;
