const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const calculatorController = require('../controllers/calculator.controller');

const validate = (validations) => async (req, res, next) => {
  for (const validation of validations) {
    const result = await validation.run(req);
    if (result.errors.length) break;
  }

  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    data: null,
    errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
  });
};

router.get('/', calculatorController.getAllCalculations);
router.post('/', [
  body('monthly_units').isNumeric().withMessage('Monthly units is required'),
  body('monthly_bill').isNumeric().withMessage('Monthly bill is required')
], validate, calculatorController.createCalculation);

router.post('/calculate', calculatorController.calculateSystem);
router.post('/save', calculatorController.saveCalculation);
router.post('/convert-to-quote', calculatorController.convertToQuote);

router.get('/:id', [param('id').isUUID().withMessage('Invalid ID')], validate, calculatorController.getCalculationById);
router.put('/:id/status', calculatorController.updateCalculationStatus);
router.delete('/:id', [param('id').isUUID().withMessage('Invalid ID')], validate, calculatorController.deleteCalculation);

module.exports = router;