const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const quoteController = require('../controllers/quote.controller');

router.post('/', authMiddleware, adminMiddleware, quoteController.createQuote);

router.get('/', quoteController.getQuotes);
router.get('/my-quotes', authMiddleware, quoteController.getCustomerQuotes);
router.get('/:id', quoteController.getQuoteById);
router.put('/:id', adminMiddleware, quoteController.updateQuote);
router.post('/:id/accept', authMiddleware, quoteController.acceptQuote);

module.exports = router;
