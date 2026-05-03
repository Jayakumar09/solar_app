const APPLIANCE_WATTS = {
  Lamp: [5, 9, 12, 15, 20, 40, 60],
  'Ceiling Fan': [28, 35, 50, 75, 90],
  'BLDC Ceiling Fan': [25, 30, 35],
  'Table Fan': [40, 60, 75],
  TV: [60, 100, 150, 200],
  Refrigerator: [100, 150, 200, 300],
  'Washing Machine': [400, 500, 700],
  'Water Pump': [750, 1000, 1500],
  'Air Conditioner': [1000, 1500, 2000],
  'Electric Iron': [750, 1000, 1500],
  Mixer: [300, 500, 750],
  Computer: [100, 150, 300],
  'Mobile Charger': [5, 10, 20],
};

const DEFAULT_WATTS = {
  Lamp: 15,
  'Ceiling Fan': 75,
  'BLDC Ceiling Fan': 30,
  'Table Fan': 60,
  TV: 100,
  Refrigerator: 150,
  'Washing Machine': 500,
  'Water Pump': 1000,
  'Air Conditioner': 1500,
  'Electric Iron': 1000,
  Mixer: 500,
  Computer: 150,
  'Mobile Charger': 10,
};

const DEFAULT_HOURS = {
  Lamp: 5,
  'Ceiling Fan': 8,
  'BLDC Ceiling Fan': 8,
  'Table Fan': 4,
  TV: 4,
  Refrigerator: 24,
  'Washing Machine': 1,
  'Water Pump': 2,
  'Air Conditioner': 6,
  'Electric Iron': 1,
  Mixer: 1,
  Computer: 4,
  'Mobile Charger': 2,
};

const DEFAULT_APPLIANCES = [
  { name: 'Lamp', hours: 5 },
  { name: 'Ceiling Fan', hours: 8 },
  { name: 'TV', hours: 4 },
  { name: 'Refrigerator', hours: 24 },
  { name: 'Washing Machine', hours: 1 },
  { name: 'Water Pump', hours: 2 },
  { name: 'Air Conditioner', hours: 6 },
  { name: 'Electric Iron', hours: 1 },
  { name: 'Mixer', hours: 1 },
  { name: 'Computer', hours: 4 },
  { name: 'Mobile Charger', hours: 2 },
];

const OTHER_ROWS = 3;
const COST_PER_KW = 50000;
const EB_RATE_PER_UNIT = 8;
const BATTERY_COST_PER_KWH = 15000;
const PANELS_PER_KW = 3;

const SOLAR_FACTORS = {
  Chennai: 5.5,
  Mumbai: 5.0,
  Delhi: 4.5,
  Bangalore: 5.2,
  Bengaluru: 5.2,
  Hyderabad: 5.3,
  Kolkata: 4.8,
  Pune: 5.1,
  Jaipur: 5.4,
  Ahmedabad: 5.3,
  Coimbatore: 5.4,
  Madurai: 5.5,
  Kochi: 5.0,
  Visakhapatnam: 5.2,
  Lucknow: 4.7,
  Patna: 4.6,
  Chandigarh: 4.8,
  Indore: 5.0,
  Bhopal: 4.9,
  Nagpur: 5.1,
  Thane: 5.0,
  'Navi Mumbai': 5.0,
  Noida: 4.5,
  Gurgaon: 4.5,
  Gurugram: 4.5,
  Faridabad: 4.5,
  Vadodara: 5.2,
  Surat: 5.2,
  Nashik: 5.1,
  Trivandrum: 5.0,
  Default: 4.5,
};

const SYSTEM_SLABS = [1, 2, 3, 5, 10];

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

export function getApplianceWattOptions(name) {
  return APPLIANCE_WATTS[name] || [50, 100, 200, 500, 1000];
}

export function getDefaultWatt(name) {
  return DEFAULT_WATTS[name] || 100;
}

export function createInitialRows() {
  return [
    ...DEFAULT_APPLIANCES.map((a, i) => ({
      id: `default-${i}`,
      name: a.name,
      watt: getDefaultWatt(a.name),
      isCustomWatt: false,
      quantity: 1,
      hours: a.hours,
      isOther: false,
      isBLDC: false,
    })),
    ...Array.from({ length: OTHER_ROWS }, (_, i) => ({
      id: `other-${i}`,
      name: '',
      watt: 0,
      isCustomWatt: true,
      quantity: 1,
      hours: 2,
      isOther: true,
      isBLDC: false,
    })),
  ];
}

function getEffectiveWatt(row) {
  let watt = row.watt || 0;
  if (isNaN(watt) || watt < 0) return 0;
  if (row.isBLDC) {
    watt = watt * 0.6;
  }
  return watt;
}

function getEffectiveHours(row) {
  let hours = parseFloat(row.hours) || 0;
  const name = row.name || '';
  if (name === 'Refrigerator') {
    hours = hours * 0.35;
  }
  if (name === 'Air Conditioner') {
    // efficiency already handled in watt
  }
  if (name === 'Washing Machine' && hours > 2) {
    hours = 2;
  }
  return hours;
}

export function calculateRowLoad(row) {
  const watt = getEffectiveWatt(row);
  const qty = parseInt(row.quantity, 10) || 0;
  return watt * qty;
}

export function getSolarFactor(city) {
  if (!city) return SOLAR_FACTORS.Default;
  const key = Object.keys(SOLAR_FACTORS).find(k => k.toLowerCase() === city.toLowerCase());
  return key ? SOLAR_FACTORS[key] : SOLAR_FACTORS.Default;
}

export function calculateAllRows(rows, city, includeBattery = false) {
  let totalLoad = 0;
  let dailyConsumption = 0;
  let validRows = 0;
  const applianceDetails = [];

  rows.forEach((row) => {
    const rawWatt = row.watt || 0;
    const qty = parseInt(row.quantity, 10) || 0;
    if (rawWatt > 0 && qty > 0) {
      const effectiveWatt = getEffectiveWatt(row);
      const effectiveHours = getEffectiveHours(row);
      const adjustedLoad = effectiveWatt * qty;
      const rowDailyKwh = (effectiveWatt * qty * effectiveHours) / 1000;

      totalLoad += adjustedLoad;
      dailyConsumption += rowDailyKwh;
      validRows++;

      applianceDetails.push({
        name: row.name || 'Unknown',
        watt: rawWatt,
        quantity: qty,
        hours: parseFloat(row.hours) || 0,
        effectiveWatt: Math.round(effectiveWatt * 100) / 100,
        effectiveHours: Math.round(effectiveHours * 100) / 100,
        adjustedLoad: Math.round(adjustedLoad * 100) / 100,
        dailyConsumption: Math.round(rowDailyKwh * 100) / 100,
        isBLDC: !!row.isBLDC,
      });
    }
  });

  const monthlyUnits = Math.round(dailyConsumption * 30 * 100) / 100;
  const solarKw = monthlyUnits / 120;
  console.log('FINAL solarKW:', solarKw);
  const recommendedKw = roundToSlab(solarKw);
  const estimatedCost = Math.round(recommendedKw * COST_PER_KW);
  const subsidy = calculateSubsidy(recommendedKw, estimatedCost);

  const batterySize = includeBattery ? Math.round(dailyConsumption * 0.5 * 10) / 10 : 0;
  const batteryCost = Math.round(batterySize * BATTERY_COST_PER_KWH);
  const totalCost = estimatedCost + batteryCost - subsidy;

  const monthlySavings = Math.round(monthlyUnits * EB_RATE_PER_UNIT);
  const yearlySavings = monthlySavings * 12;
  const paybackYears = yearlySavings > 0 ? Math.round((totalCost / yearlySavings) * 10) / 10 : 0;

  const roiData = [];
  let cumulativeSavings = 0;
  for (let year = 0; year <= 25; year++) {
    cumulativeSavings += yearlySavings;
    roiData.push({
      year,
      cumulativeSavings: Math.round(cumulativeSavings),
      netValue: Math.round(cumulativeSavings - totalCost),
    });
  }

  return {
    totalLoad: Math.round(totalLoad),
    dailyUnits: Math.round(dailyConsumption * 100) / 100,
    monthlyUnits,
    solarKw: Math.round(solarKw * 100) / 100,
    recommendedKw,
    solarFactor: getSolarFactor(city),
    estimatedCost,
    subsidy,
    batteryIncluded: includeBattery,
    batterySize,
    batteryCost,
    totalCost,
    monthlySavings,
    yearlySavings,
    paybackYears,
    roiData,
    validRows,
    applianceDetails,
  };
}

export function calculateSolarFromBill(monthlyUnits) {
  const solarKw = monthlyUnits / 120;
  console.log('FINAL solarKW:', solarKw);
  const recommendedKw = roundToSlab(solarKw);
  const estimatedCost = Math.round(recommendedKw * COST_PER_KW);
  const subsidy = calculateSubsidy(recommendedKw, estimatedCost);
  const panels = Math.round(recommendedKw * PANELS_PER_KW);
  const dailyUnits = Math.round((monthlyUnits / 30) * 100) / 100;
  const monthlySavings = Math.round(monthlyUnits * EB_RATE_PER_UNIT);
  const yearlySavings = monthlySavings * 12;
  const totalCost = estimatedCost - subsidy;
  const paybackYears = yearlySavings > 0 ? Math.round((totalCost / yearlySavings) * 10) / 10 : 0;

  const roiData = [];
  let cumulativeSavings = 0;
  for (let year = 0; year <= 25; year++) {
    cumulativeSavings += yearlySavings;
    roiData.push({
      year,
      cumulativeSavings: Math.round(cumulativeSavings),
      netValue: Math.round(cumulativeSavings - totalCost),
    });
  }

  return {
    solarKw: Math.round(solarKw * 100) / 100,
    recommendedKw,
    estimatedCost,
    subsidy,
    totalCost,
    panels,
    dailyUnits,
    monthlyUnits,
    monthlySavings,
    yearlySavings,
    paybackYears,
    roiData,
  };
}

export function getApplianceSummary(rows) {
  return rows
    .filter((r) => (r.watt || 0) > 0 && r.name)
    .map((r) => {
      const qty = parseInt(r.quantity, 10) || 0;
      return {
        name: r.name,
        watt: r.watt,
        quantity: qty,
        hours: parseFloat(r.hours) || 0,
        adjustedLoad: getEffectiveWatt(r) * qty,
      };
    });
}

export { APPLIANCE_WATTS, COST_PER_KW, EB_RATE_PER_UNIT, SOLAR_FACTORS, BATTERY_COST_PER_KWH, PANELS_PER_KW, SYSTEM_SLABS };
