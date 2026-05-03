const WATT_OPTIONS = [15, 25, 40, 60, 75, 100, 200, 500, 1000, 1500];

const DEFAULT_APPLIANCES = [
  { name: 'Lamp', watts: 40, hours: 5 },
  { name: 'Ceiling Fan', watts: 75, hours: 8 },
  { name: 'TV', watts: 100, hours: 4 },
  { name: 'Refrigerator', watts: 200, hours: 24 },
  { name: 'Washing Machine', watts: 500, hours: 1 },
  { name: 'Water Pump', watts: 1000, hours: 2 },
  { name: 'Air Conditioner', watts: 1500, hours: 6 },
  { name: 'Electric Iron', watts: 1000, hours: 1 },
  { name: 'Mixer', watts: 500, hours: 1 },
  { name: 'Computer', watts: 200, hours: 4 },
  { name: 'Mobile Charger', watts: 15, hours: 2 },
];

const OTHER_ROWS = 3;
const COST_PER_KW = 50000;
const EB_RATE_PER_UNIT = 8;
const BATTERY_COST_PER_KWH = 15000;

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

const DUTY_CYCLE = {
  'Refrigerator': 0.35,
};

const EFFICIENCY_FACTOR = {
  'Air Conditioner': 0.8,
};

const MAX_HOURS = {
  'Washing Machine': 2,
};

const BLDC_FAN_KEYWORDS = ['bldc', 'ceiling fan', 'fan'];

export function createInitialRows() {
  return [
    ...DEFAULT_APPLIANCES.map((a, i) => ({
      id: `default-${i}`,
      name: a.name,
      wattDropdown: getClosestWatt(a.watts),
      customWatt: isExactWatt(a.watts) ? '' : String(a.watts),
      quantity: 1,
      hours: a.hours,
      isOther: false,
      isBLDC: false,
    })),
    ...Array.from({ length: OTHER_ROWS }, (_, i) => ({
      id: `other-${i}`,
      name: '',
      wattDropdown: '',
      customWatt: '',
      quantity: 1,
      hours: 2,
      isOther: true,
      isBLDC: false,
    })),
  ];
}

function getClosestWatt(watts) {
  if (WATT_OPTIONS.includes(watts)) return String(watts);
  return 'other';
}

function isExactWatt(watts) {
  return WATT_OPTIONS.includes(watts);
}

export function getWattForRow(row) {
  if (row.wattDropdown === 'other') {
    const custom = parseFloat(row.customWatt);
    return isNaN(custom) || custom <= 0 ? 0 : custom;
  }
  const dropdown = parseInt(row.wattDropdown, 10);
  return isNaN(dropdown) ? 0 : dropdown;
}

function getEffectiveHours(row) {
  let hours = parseFloat(row.hours) || 0;
  const name = row.name || '';

  if (DUTY_CYCLE[name]) {
    hours = hours * DUTY_CYCLE[name];
  }

  if (MAX_HOURS[name] && hours > MAX_HOURS[name]) {
    hours = MAX_HOURS[name];
  }

  return hours;
}

function getEffectiveWatt(row) {
  let watt = getWattForRow(row);
  const name = row.name || '';

  if (EFFICIENCY_FACTOR[name]) {
    watt = watt * EFFICIENCY_FACTOR[name];
  }

  if (row.isBLDC || BLDC_FAN_KEYWORDS.some(kw => name.toLowerCase().includes(kw))) {
    if (row.isBLDC) {
      watt = watt * 0.6;
    }
  }

  return watt;
}

export function calculateRowLoad(row) {
  const effectiveWatt = getEffectiveWatt(row);
  const qty = parseInt(row.quantity, 10) || 0;
  return effectiveWatt * qty;
}

export function calculateRowAdjustedLoad(row) {
  const effectiveWatt = getEffectiveWatt(row);
  const effectiveHours = getEffectiveHours(row);
  const qty = parseInt(row.quantity, 10) || 0;
  return {
    effectiveWatt: Math.round(effectiveWatt * 100) / 100,
    effectiveHours: Math.round(effectiveHours * 100) / 100,
    adjustedLoad: Math.round(effectiveWatt * qty * 100) / 100,
    dailyConsumption: Math.round((effectiveWatt * qty * effectiveHours) / 1000 * 100) / 100,
  };
}

export function getSolarFactor(city) {
  if (!city) return SOLAR_FACTORS.Default;
  const key = Object.keys(SOLAR_FACTORS).find(k => k.toLowerCase() === city.toLowerCase());
  return key ? SOLAR_FACTORS[key] : SOLAR_FACTORS.Default;
}

export function calculateAllRows(rows, city, includeBattery = false) {
  let totalLoad = 0;
  let weightedHoursSum = 0;
  let validRows = 0;
  const applianceDetails = [];

  rows.forEach((row) => {
    const rawLoad = getWattForRow(row) * (parseInt(row.quantity, 10) || 0);
    if (rawLoad > 0) {
      const adjusted = calculateRowAdjustedLoad(row);
      totalLoad += adjusted.adjustedLoad;
      weightedHoursSum += adjusted.adjustedLoad * adjusted.effectiveHours;
      validRows++;
      applianceDetails.push({
        name: row.name || 'Unknown',
        watt: getWattForRow(row),
        effectiveWatt: adjusted.effectiveWatt,
        quantity: parseInt(row.quantity, 10) || 0,
        hours: parseFloat(row.hours) || 0,
        effectiveHours: adjusted.effectiveHours,
        adjustedLoad: adjusted.adjustedLoad,
        dailyConsumption: adjusted.dailyConsumption,
        isBLDC: !!row.isBLDC,
      });
    }
  });

  const dailyUnits = weightedHoursSum / 1000;
  const solarFactor = getSolarFactor(city);
  const monthlyUnits = dailyUnits * 30;
  const requiredKw = dailyUnits / solarFactor;
  const estimatedCost = Math.round(requiredKw * COST_PER_KW);

  const batterySize = includeBattery ? Math.round(dailyUnits * 0.5 * 10) / 10 : 0;
  const batteryCost = Math.round(batterySize * BATTERY_COST_PER_KWH);
  const totalCost = estimatedCost + batteryCost;

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
    dailyUnits: Math.round(dailyUnits * 100) / 100,
    monthlyUnits: Math.round(monthlyUnits * 100) / 100,
    requiredKw: Math.round(requiredKw * 100) / 100,
    solarFactor,
    estimatedCost,
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

export function calculateSolarRecommendation(dailyUnits, city) {
  const solarFactor = getSolarFactor(city);
  const requiredKw = dailyUnits / solarFactor;
  const estimatedCost = Math.round(requiredKw * COST_PER_KW);
  const monthlyUnits = dailyUnits * 30;
  const monthlySavings = Math.round(monthlyUnits * EB_RATE_PER_UNIT);
  const yearlySavings = monthlySavings * 12;

  return {
    requiredKw: Math.round(requiredKw * 100) / 100,
    estimatedCost,
    monthlySavings,
    yearlySavings,
    solarFactor,
  };
}

export function getApplianceSummary(rows) {
  return rows
    .filter((r) => getWattForRow(r) > 0 && r.name)
    .map((r) => {
      const adjusted = calculateRowAdjustedLoad(r);
      return {
        name: r.name,
        watt: getWattForRow(r),
        effectiveWatt: adjusted.effectiveWatt,
        quantity: parseInt(r.quantity, 10) || 0,
        hours: parseFloat(r.hours) || 0,
        effectiveHours: adjusted.effectiveHours,
        adjustedLoad: adjusted.adjustedLoad,
        isBLDC: !!r.isBLDC,
      };
    });
}

export { WATT_OPTIONS, COST_PER_KW, EB_RATE_PER_UNIT, SOLAR_FACTORS, BATTERY_COST_PER_KWH };
