const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

router.use(authMiddleware);

router.get('/customers', adminMiddleware, userController.getCustomers);
router.get('/', adminMiddleware, userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', adminMiddleware, userController.deleteUser);

module.exports = router;
