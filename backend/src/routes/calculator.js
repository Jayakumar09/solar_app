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

const COST_PER_KW = 50000;
const EB_RATE_PER_UNIT = 8;
const PANELS_PER_KW = 3;

const SOLAR_FACTORS = {
  Chennai: 5.5, Mumbai: 5.0, Delhi: 4.5, Bangalore: 5.2, Bengaluru: 5.2,
  Hyderabad: 5.3, Kolkata: 4.8, Pune: 5.1, Jaipur: 5.4, Ahmedabad: 5.3,
  Coimbatore: 5.4, Madurai: 5.5, Kochi: 5.0, Visakhapatnam: 5.2,
  Lucknow: 4.7, Patna: 4.6, Chandigarh: 4.8, Indore: 5.0, Bhopal: 4.9,
  Nagpur: 5.1, Thane: 5.0, 'Navi Mumbai': 5.0, Noida: 4.5, Gurgaon: 4.5,
  Gurugram: 4.5, Faridabad: 4.5, Vadodara: 5.2, Surat: 5.2, Nashik: 5.1,
  Trivandrum: 5.0, Default: 4.5,
};

function getSolarFactor(city) {
  if (!city) return SOLAR_FACTORS.Default;
  const key = Object.keys(SOLAR_FACTORS).find(k => k.toLowerCase() === city.toLowerCase());
  return key ? SOLAR_FACTORS[key] : SOLAR_FACTORS.Default;
}

function roundToSlab(kw) {
  if (kw <= 1) return 1;
  if (kw <= 2) return 2;
  if (kw <= 3) return 3;
  if (kw <= 5) return 5;
  if (kw <= 10) return 10;
  return Math.ceil(kw);
}

function calculateSubsidy(kw, systemCost) {
  const costPerKw = systemCost / kw;
  let subsidy = 0;
  if (kw <= 2) {
    subsidy = systemCost * 0.4;
  } else if (kw <= 3) {
    subsidy = systemCost * 0.3;
  } else {
    subsidy = (3 * costPerKw) * 0.3;
  }
  return Math.round(subsidy);
}

router.post('/calculate', async (req, res) => {
  try {
    const { monthlyUnits, city = 'Mumbai' } = req.body;
    const units = parseFloat(monthlyUnits) || 0;
    if (!units || units <= 0) {
      return res.status(400).json({ error: 'Monthly units required' });
    }

    const solarKw = units / 120;
    const recommendedKw = roundToSlab(solarKw);
    const solarFactor = getSolarFactor(city);

    const estimatedCost = Math.round(recommendedKw * COST_PER_KW);
    const subsidy = calculateSubsidy(recommendedKw, estimatedCost);
    const totalCost = estimatedCost - subsidy;
    const panels = Math.round(recommendedKw * PANELS_PER_KW);
    const dailyUnits = Math.round((units / 30) * 100) / 100;
    const monthlySavings = Math.round(units * EB_RATE_PER_UNIT);
    const annualSavings = monthlySavings * 12;
    const paybackYears = annualSavings > 0 ? Math.round((totalCost / annualSavings) * 10) / 10 : 0;

    const results = {
      systemSizeKw: recommendedKw,
      recommendedSystemKw: recommendedKw,
      idealSystemKw: recommendedKw,
      roofFitSystemKw: recommendedKw,
      panelCount: panels,
      solarKw,
      solarFactor,
      estimatedCost,
      subsidyAmount: subsidy,
      totalProjectCost: estimatedCost,
      totalCost,
      costAfterSubsidy: totalCost,
      panels,
      monthlyUnits: units,
      dailyUnits,
      monthlyGenerationKwh: Math.round(units * 0.9),
      annualGenerationKwh: Math.round(units * 0.9 * 12),
      monthlySavings,
      annualSavings,
      savingsMonthly: monthlySavings,
      savingsYearly: annualSavings,
      paybackYears,
      costPerWatt: Math.round(totalCost / (recommendedKw * 1000)),
      finalSellingPrice: totalCost,
      finalPrice: totalCost,
    };

    console.log('FINAL solarKW:', solarKw);
    res.json({ success: true, data: { results } });
  } catch (err) {
    console.error('Calculation error:', err.message);
    res.status(500).json({ error: 'Calculation failed' });
  }
});

export default router;
