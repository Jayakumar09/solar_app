const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const profileController = require('../controllers/profile.controller');

router.get('/', authMiddleware, profileController.getProfile);
router.put('/', authMiddleware, profileController.updateProfile);
router.post('/documents', authMiddleware, profileController.uploadDocument);

module.exports = router;
