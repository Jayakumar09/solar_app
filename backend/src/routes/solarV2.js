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

  res.json({
    solarKW,
    panels,
    dailyUnits,
    monthlyUnits,
  });
});

export default router;
