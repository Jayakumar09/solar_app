import express from 'express';

const router = express.Router();

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

router.post('/calculate', (req, res) => {
  const monthlyUnits = toNumber(req.body?.monthlyUnits);
  const solarKW = monthlyUnits / 120;
  const panels = solarKW * 2;
  const dailyUnits = monthlyUnits / 30;
  const monthlySavings = Math.round(monthlyUnits * 8);
  const yearlySavings = monthlySavings * 12;

  res.json({
    solarKW: parseFloat(solarKW.toFixed(2)),
    panels: Math.round(panels),
    dailyUnits: parseFloat(dailyUnits.toFixed(2)),
    monthlyUnits,
    monthlySavings,
    yearlySavings,
  });
});

export default router;
