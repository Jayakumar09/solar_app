import express from 'express';
import {
  getCalculations,
  calculateSystem,
  saveCalculation,
  deleteCalculation,
  convertToQuote,
} from '../controllers/calculatorController.js';

const router = express.Router();

router.get('/', getCalculations);
router.post('/calculate', calculateSystem);
router.post('/save', saveCalculation);
router.delete('/:id', deleteCalculation);
router.post('/convert-to-quote', convertToQuote);

export default router;