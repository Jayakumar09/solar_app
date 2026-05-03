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
const SOLAR_UNITS_PER_KW_PER_DAY = 4.5;
const COST_PER_KW = 50000;
const EB_RATE_PER_UNIT = 8;

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
    })),
    ...Array.from({ length: OTHER_ROWS }, (_, i) => ({
      id: `other-${i}`,
      name: '',
      wattDropdown: '',
      customWatt: '',
      quantity: 1,
      hours: 2,
      isOther: true,
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

export function calculateRowLoad(row) {
  const watt = getWattForRow(row);
  const qty = parseInt(row.quantity, 10) || 0;
  return watt * qty;
}

export function calculateAllRows(rows) {
  let totalLoad = 0;
  let weightedHoursSum = 0;
  let validRows = 0;

  rows.forEach((row) => {
    const load = calculateRowLoad(row);
    if (load > 0) {
      totalLoad += load;
      weightedHoursSum += load * (parseFloat(row.hours) || 0);
      validRows++;
    }
  });

  const dailyUnits = weightedHoursSum / 1000;
  const monthlyUnits = dailyUnits * 30;
  const requiredKw = dailyUnits / SOLAR_UNITS_PER_KW_PER_DAY;
  const estimatedCost = Math.round(requiredKw * COST_PER_KW);
  const monthlySavings = Math.round(monthlyUnits * EB_RATE_PER_UNIT);
  const yearlySavings = monthlySavings * 12;

  return {
    totalLoad,
    dailyUnits: Math.round(dailyUnits * 100) / 100,
    monthlyUnits: Math.round(monthlyUnits * 100) / 100,
    requiredKw: Math.round(requiredKw * 100) / 100,
    estimatedCost,
    monthlySavings,
    yearlySavings,
    validRows,
  };
}

export function calculateSolarRecommendation(dailyUnits) {
  const requiredKw = dailyUnits / SOLAR_UNITS_PER_KW_PER_DAY;
  const estimatedCost = Math.round(requiredKw * COST_PER_KW);
  const monthlyUnits = dailyUnits * 30;
  const monthlySavings = Math.round(monthlyUnits * EB_RATE_PER_UNIT);
  const yearlySavings = monthlySavings * 12;

  return {
    requiredKw: Math.round(requiredKw * 100) / 100,
    estimatedCost,
    monthlySavings,
    yearlySavings,
  };
}

export function getApplianceSummary(rows) {
  return rows
    .filter((r) => calculateRowLoad(r) > 0 && r.name)
    .map((r) => ({
      name: r.name,
      watts: getWattForRow(r),
      quantity: parseInt(r.quantity, 10) || 0,
      hours: parseFloat(r.hours) || 0,
      load: calculateRowLoad(r),
    }));
}

export { WATT_OPTIONS, COST_PER_KW, EB_RATE_PER_UNIT };
