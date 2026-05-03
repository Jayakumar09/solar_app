import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

const createCalculatorTable = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS calculator_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        phone VARCHAR(50),
        email VARCHAR(255),
        city VARCHAR(100),
        roof_type VARCHAR(50),
        roof_area NUMERIC,
        monthly_units NUMERIC,
        total_load NUMERIC,
        daily_units NUMERIC,
        solar_kw NUMERIC,
        solar_factor NUMERIC,
        estimated_cost NUMERIC,
        savings_monthly NUMERIC,
        savings_yearly NUMERIC,
        battery_included BOOLEAN DEFAULT false,
        battery_size NUMERIC,
        battery_cost NUMERIC,
        total_cost NUMERIC,
        payback_years NUMERIC,
        appliances JSONB,
        roi_data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Calculator submissions table ready');
  } catch (err) {
    console.error('❌ Calculator table creation failed:', err.message);
  }
};

createCalculatorTable();

router.post('/submit', async (req, res) => {
  try {
    const {
      name, phone, email, city, roofType, roofArea,
      monthlyUnits, totalLoad, dailyUnits, solarKw, solarFactor,
      estimatedCost, savingsMonthly, savingsYearly,
      batteryIncluded, batterySize, batteryCost, totalCost, paybackYears,
      appliances, roiData,
    } = req.body;

    if (!city && !totalLoad && !dailyUnits) {
      return res.status(400).json({ error: 'At least city or load data is required' });
    }

    const result = await query(
      `INSERT INTO calculator_submissions (
        name, phone, email, city, roof_type, roof_area,
        monthly_units, total_load, daily_units, solar_kw, solar_factor,
        estimated_cost, savings_monthly, savings_yearly,
        battery_included, battery_size, battery_cost, total_cost, payback_years,
        appliances, roi_data
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING id, created_at`,
      [
        name || null,
        phone || null,
        email || null,
        city || null,
        roofType || null,
        roofArea || null,
        monthlyUnits || 0,
        totalLoad || 0,
        dailyUnits || 0,
        solarKw || 0,
        solarFactor || 4.5,
        estimatedCost || 0,
        savingsMonthly || 0,
        savingsYearly || 0,
        batteryIncluded || false,
        batterySize || 0,
        batteryCost || 0,
        totalCost || estimatedCost || 0,
        paybackYears || 0,
        JSON.stringify(appliances || []),
        JSON.stringify(roiData || []),
      ]
    );

    res.json({
      success: true,
      id: result.rows[0].id,
      created_at: result.rows[0].created_at,
      message: 'Calculation saved successfully',
    });
  } catch (err) {
    console.error('Calculator submission error:', err.message);
    res.status(500).json({ error: 'Failed to save calculation', details: err.message });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, city, solar_kw, total_cost, payback_years, battery_included, created_at
       FROM calculator_submissions
       ORDER BY created_at DESC
       LIMIT 20`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch calculations' });
  }
});

export default router;
