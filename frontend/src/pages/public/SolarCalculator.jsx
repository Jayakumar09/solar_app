import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calculator,
  CheckCircle,
  MapPin,
  RotateCcw,
  Sun,
  Zap,
} from 'lucide-react';

const APPLIANCE_LIST = [
  'Lamp',
  'Ceiling Fan',
  'Table Fan',
  'TV',
  'Geyser',
  'Heater',
  'Immersion Rod',
  'Refrigerator',
  'Washing Machine',
  'Water Pump',
  'Air Conditioner',
  'Electric Iron',
  'Mixer',
  'Personal Computer',
  'Dhobi Iron',
  'Stove',
  'Electric Cooker',
  'Toaster',
  'Cloth Drier / Spin Drier',
  'Mobile Charger',
  'Oven 2 plates / 3 plates',
  'Cooking Range',
  'BLDC Ceiling Fan',
  'Grinder',
  'Electric Stove',
];

const WATT_VALUES = {
  "Lamp": [5, 9, 12, 15],
  "Ceiling Fan": [60, 75, 90],
  "Table Fan": [40, 55, 75],
  "TV": [60, 100, 150],
  "Geyser": [1000, 1500, 2000],
  "Heater": [1000, 1500, 2000],
  "Immersion Rod": [1000, 1500],
  "Refrigerator": [150, 200, 300],
  "Washing Machine": [400, 500, 700],
  "Water Pump": [750, 1000, 1500],
  "Air Conditioner": [1000, 1500, 2000],
  "Electric Iron": [750, 1000],
  "Mixer": [300, 500],
  "Personal Computer": [150, 250],
  "Dhobi Iron": [1000, 1200],
  "Stove": [1000, 1500],
  "Electric Cooker": [1200, 1800],
  "Toaster": [800, 1200],
  "Cloth Drier / Spin Drier": [1000, 1500],
  "Mobile Charger": [5, 10],
  "Oven 2 plates / 3 plates": [1500, 2000],
  "Cooking Range": [2000, 3000],
  "BLDC Ceiling Fan": [25, 35],
  "Grinder": [500, 750],
  "Electric Stove": [1200, 2000]
};

const getDefaultWatt = (applianceName) => {
  const values = WATT_VALUES[applianceName];
  if (!values || values.length === 0) return '';
  const midIndex = Math.floor(values.length / 2);
  return String(values[midIndex]);
};

const emptyRow = (id, name = '') => ({
  id,
  name,
  watt: name ? getDefaultWatt(name) : '',
  wattType: 'preset',
  customWatt: '',
  quantity: '1',
  hours: '',
});

const initialRows = () => APPLIANCE_LIST.map((name, index) => 
  emptyRow(index + 1, name)
);

const toPositiveNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
};

const clampHours = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return '0';
  if (num > 24) return '24';
  return value;
};

const clampQuantity = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 1) return '1';
  if (num > 20) return '20';
  return value;
};

const clampCustomWatt = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return '';
  return String(num);
};

const getWattValue = (row) => {
  if (row.wattType === 'custom') return toPositiveNumber(row.customWatt);
  return toPositiveNumber(row.watt);
};

const getApplianceMonthlyUnits = (rows) => {
  const dailyUnits = rows.reduce((total, row) => {
    const watt = getWattValue(row);
    const quantity = toPositiveNumber(row.quantity);
    const hours = toPositiveNumber(row.hours);
    return total + (watt * quantity * hours) / 1000;
  }, 0);
  return dailyUnits * 30;
};

const getTotalLoadW = (rows) => {
  return rows.reduce((total, row) => {
    const watt = getWattValue(row);
    const quantity = toPositiveNumber(row.quantity);
    return total + (watt * quantity);
  }, 0);
};

const SolarCalculator = () => {
  const navigate = useNavigate();
  const [monthlyUnitsInput, setMonthlyUnitsInput] = useState('');
  const [currentBill, setCurrentBill] = useState('');
  const [roofType, setRoofType] = useState('concrete');
  const [roofArea, setRoofArea] = useState('');
  const [location, setLocation] = useState('');
  const [useAppliances, setUseAppliances] = useState(true);
  const [rows, setRows] = useState(initialRows);
  const [result, setResult] = useState(null);
  const [panelSize, setPanelSize] = useState(500);

  const unitRate = 8;
  const applianceMonthlyUnits = useMemo(() => getApplianceMonthlyUnits(rows), [rows]);
  const totalLoadW = useMemo(() => getTotalLoadW(rows), [rows]);

  const hasUnitsInput = toPositiveNumber(monthlyUnitsInput) > 0;
  const hasBillInput = toPositiveNumber(currentBill) > 0;
  const estimatedUnitsFromBill = hasBillInput ? Math.round((toPositiveNumber(currentBill) / unitRate) * 100) / 100 : 0;
  const unitsFromBillActive = !useAppliances && !hasUnitsInput && hasBillInput;
  const effectiveMonthlyUnits = useAppliances
    ? applianceMonthlyUnits
    : hasUnitsInput
      ? toPositiveNumber(monthlyUnitsInput)
      : estimatedUnitsFromBill;
  const unitsSource = useAppliances
    ? 'appliance'
    : hasUnitsInput
      ? 'units'
      : hasBillInput
        ? 'bill'
        : 'none';

  const avgHoursPerDay = 8;
  const dailyFromEffective = effectiveMonthlyUnits > 0 ? effectiveMonthlyUnits / 30 : 0;
  const dailyUsageKwh = dailyFromEffective;
  const recommendedKW = effectiveMonthlyUnits > 0 ? effectiveMonthlyUnits / 120 : 0;

  const calculateLocal = (units, panelWatt) => {
    const solarKW = units / 120;
    const panels = Math.ceil((solarKW * 1000) / panelWatt);
    const dailyUnits = Math.round((units / 30) * 100) / 100;
    const monthlySavings = Math.round(units * 8);
    const yearlySavings = monthlySavings * 12;

    return {
      solarKW: parseFloat(solarKW.toFixed(2)),
      panels,
      dailyUnits,
      monthlyUnits: units,
      monthlySavings,
      yearlySavings,
    };
  };

  const updateRow = (id, field, value) => {
    setRows((currentRows) => currentRows.map((row) => {
      if (row.id === id) {
        let processedValue = value;
        if (field === 'hours') {
          processedValue = clampHours(value);
        } else if (field === 'quantity') {
          processedValue = clampQuantity(value);
        } else if (field === 'customWatt') {
          processedValue = clampCustomWatt(value);
        }
        const updated = { ...row, [field]: processedValue };
        if (field === 'name' && value) {
          updated.watt = getDefaultWatt(value);
          updated.wattType = 'preset';
        }
        return updated;
      }
      return row;
    }));
  };

  const triggerRecalc = () => {
    const units = effectiveMonthlyUnits;
    if (units > 0) {
      setResult(calculateLocal(units, panelSize));
    }
  };

  const handleRowBlur = (id, field) => {
    setRows((currentRows) => currentRows.map((row) => {
      if (row.id === id) {
        const updated = { ...row };
        if (field === 'hours') {
          const val = toPositiveNumber(row.hours);
          updated.hours = val > 24 ? '24' : String(Math.max(0, val));
        } else if (field === 'quantity') {
          const val = toPositiveNumber(row.quantity);
          updated.quantity = String(Math.max(1, Math.min(20, val || 1)));
        } else if (field === 'customWatt' && row.wattType === 'custom') {
          if (!toPositiveNumber(row.customWatt)) {
            updated.wattType = 'preset';
            updated.customWatt = '';
            updated.watt = getDefaultWatt(row.name);
          }
        }
        return updated;
      }
      return row;
    }));
    setTimeout(() => triggerRecalc(), 0);
  };

  const addRow = () => {
    setRows((currentRows) => [...currentRows, emptyRow(Date.now(), '')]);
    setResult(null);
  };

  const resetRows = () => {
    setRows(initialRows());
    setResult(null);
  };

  const calculateSystem = () => {
    const units = effectiveMonthlyUnits;

    if (units <= 0) {
      return;
    }

    const calculationResult = calculateLocal(units, panelSize);
    setResult(calculationResult);
  };

  const handlePanelSizeChange = (newPanelSize) => {
    setPanelSize(newPanelSize);
    if (result) {
      setResult(calculateLocal(result.monthlyUnits, newPanelSize));
    }
  };

  const handleGetQuote = () => {
    if (!result) return;

    navigate('/quote-request', {
      state: {
        fromCalculator: true,
        monthlyUnits: result.monthlyUnits,
        currentBill,
        location,
        roofType,
        roofArea,
        solarData: {
          requiredKw: result.solarKW,
          panels: result.panels,
          dailyUnits: result.dailyUnits,
        },
        applianceData: useAppliances ? {
          monthlyUnits: result.monthlyUnits,
          appliances: rows.filter(r => getWattValue(r) > 0 && toPositiveNumber(r.quantity) > 0 && toPositiveNumber(r.hours) > 0).map(r => ({
            name: r.name,
            watt: getWattValue(r),
            quantity: toPositiveNumber(r.quantity),
            hours: toPositiveNumber(r.hours),
          })),
        } : null,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Calculator className="w-8 h-8 text-primary-900" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Solar Calculator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Calculate solar size from your monthly electricity use</p>
        </motion.div>

        <div className="grid lg:grid-cols-[65%_35%] gap-8">
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" /> Enter Your Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Electricity Consumption (Units)</label>
                <input
                  type="number"
                  min="1"
                  value={useAppliances ? applianceMonthlyUnits.toFixed(2) : unitsFromBillActive ? String(estimatedUnitsFromBill) : monthlyUnitsInput}
                  onChange={(event) => {
                    setMonthlyUnitsInput(event.target.value);
                    setResult(null);
                  }}
                  placeholder="e.g., 600"
                  readOnly={useAppliances || unitsFromBillActive}
                  className={`w-full px-4 py-3 rounded-xl border ${useAppliances || unitsFromBillActive ? 'bg-gray-50 border-gray-300' : 'border-gray-200'} focus:ring-2 focus:ring-amber-500 outline-none text-lg`}
                />
                <p className="text-xs mt-1">
                  {useAppliances ? (
                    <span className="text-gray-500">Calculated from appliance rows below</span>
                  ) : unitsFromBillActive ? (
                    <span className="text-amber-600 font-medium">✓ Units estimated from bill (₹{unitRate}/unit)</span>
                  ) : hasUnitsInput ? (
                    <span className="text-green-600 font-medium">✓ Using provided units</span>
                  ) : null}
                </p>
              </div>

              {!useAppliances && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Electricity Bill (Rs)</label>
                  <input
                    type="number"
                    min="1"
                    value={currentBill}
                    onChange={(event) => {
                      setCurrentBill(event.target.value);
                      setResult(null);
                    }}
                    placeholder="e.g., 5000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none text-lg"
                  />
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Roof Type</label>
                  <select
                    value={roofType}
                    onChange={(event) => setRoofType(event.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="concrete">Concrete</option>
                    <option value="tin">Tin/Sheet</option>
                    <option value="tiled">Tiled</option>
                    <option value="flat">Flat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Roof Area (sq ft)</label>
                  <input
                    type="number"
                    min="0"
                    value={roofArea}
                    onChange={(event) => setRoofArea(event.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location (City)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="e.g., Mumbai, Chennai, Delhi"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">Appliance Units</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Optional</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUseAppliances((enabled) => !enabled);
                      setResult(null);
                    }}
                    className={`relative w-14 h-7 rounded-full transition-colors ${useAppliances ? 'bg-green-500' : 'bg-gray-300'}`}
                    aria-label="Toggle appliance calculation"
                  >
                    <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${useAppliances ? 'translate-x-7' : ''}`} />
                  </button>
                </div>

                {useAppliances && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-600">Monthly Units: <span className="font-bold text-green-700">{applianceMonthlyUnits.toFixed(2)}</span></p>
                      <button type="button" onClick={resetRows} className="text-sm flex items-center gap-1 text-gray-500 hover:text-amber-600">
                        <RotateCcw className="w-4 h-4" /> Reset
                      </button>
                    </div>

                    <div className="rounded-xl border border-gray-200 overflow-hidden" style={{ maxHeight: '450px' }}>
                      <div className="overflow-y-auto" style={{ maxHeight: '450px' }}>
                        <table className="solar-table w-full text-sm" style={{ tableLayout: 'fixed', width: '100%' }}>
                          <colgroup>
                            <col style={{ width: '30%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '12%' }} />
                            <col style={{ width: '18%' }} />
                            <col style={{ width: '20%' }} />
                          </colgroup>
                          <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                              <th className="text-left px-3 py-3 font-semibold text-gray-600">Appliance</th>
                              <th className="text-left px-2 py-3 font-semibold text-gray-600">Watt</th>
                              <th className="text-left px-2 py-3 font-semibold text-gray-600">Qty</th>
                              <th className="text-left px-2 py-3 font-semibold text-gray-600">Hours/day</th>
                              <th className="text-right px-3 py-3 font-semibold text-gray-600">Units/month</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row) => {
                              const rowUnits = (getWattValue(row) * toPositiveNumber(row.quantity) * toPositiveNumber(row.hours) * 30) / 1000;
                              return (
                                <tr key={row.id} className="border-t border-gray-100">
                                  <td className="px-3 py-2">
                                    <input
                                      type="text"
                                      list="appliances"
                                      value={row.name}
                                      onChange={(event) => updateRow(row.id, 'name', event.target.value)}
                                      className="table-input w-full px-2 py-2 rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                  </td>
                                  <td className="px-2 py-2">
                                    <div className="flex gap-1">
                                      <select
                                        value={row.wattType === 'custom' ? 'custom' : row.watt}
                                        onChange={(event) => {
                                          if (event.target.value === 'custom') {
                                            updateRow(row.id, 'wattType', 'custom');
                                          } else {
                                            updateRow(row.id, 'watt', event.target.value);
                                            updateRow(row.id, 'wattType', 'preset');
                                          }
                                        }}
                                        className="table-input flex-1 px-2 py-2 rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-amber-500"
                                      >
                                        <option value="">Select</option>
                                        {(WATT_VALUES[row.name] || []).map((w) => (
                                          <option key={w} value={String(w)}>{w}W</option>
                                        ))}
                                        <option value="custom">Custom</option>
                                      </select>
                                      {row.wattType === 'custom' && (
                                        <input
                                          type="number"
                                          min="1"
                                          value={row.customWatt}
                                          onChange={(event) => updateRow(row.id, 'customWatt', event.target.value)}
                                          onBlur={() => handleRowBlur(row.id, 'customWatt')}
                                          placeholder="W"
                                          className="table-input w-full px-1 py-2 rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-amber-500"
                                        />
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2">
                                    <input
                                      type="number"
                                      min="1"
                                      max="20"
                                      value={row.quantity}
                                      onChange={(event) => updateRow(row.id, 'quantity', event.target.value)}
                                      onBlur={() => handleRowBlur(row.id, 'quantity')}
                                      className="qty-input"
                                    />
                                  </td>
                                  <td className="px-2 py-2">
                                    <input
                                      type="number"
                                      min="0"
                                      max="24"
                                      step="0.5"
                                      value={row.hours}
                                      onChange={(event) => updateRow(row.id, 'hours', event.target.value)}
                                      onBlur={() => handleRowBlur(row.id, 'hours')}
                                      className="table-input w-full px-2 py-2 rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-amber-500"
                                      style={{ height: '36px' }}
                                    />
                                  </td>
                                  <td className="px-3 py-2 text-right font-semibold text-gray-700">{rowUnits.toFixed(2)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <datalist id="appliances">
                        {APPLIANCE_LIST.map((appliance) => (
                          <option key={appliance} value={appliance} />
                        ))}
                      </datalist>
                    </div>

                    <button type="button" onClick={addRow} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                      Add Appliance
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={calculateSystem}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-primary-900 font-bold text-lg rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" /> Calculate Solar
              </button>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-3xl p-8 shadow-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {!result ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-gray-400">
                <Sun className="w-20 h-20 mb-4 opacity-30" />
                <p className="text-lg font-medium">Enter units to see results</p>
                <p className="text-sm">Uses Monthly Units / 120 formula</p>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" /> Your Solar Report
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-5 text-center">
                    <div className="text-4xl font-bold text-primary-900 mb-1">{result.solarKW.toFixed(2)}</div>
                    <div className="text-sm font-semibold text-primary-800">kW System</div>
                  </div>
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 text-center">
                    <div className="text-4xl font-bold text-white mb-1">{result.panels}</div>
                    <div className="text-sm font-semibold text-white/80">Panels Required</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Panel Configuration</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Panel Size</label>
                      <select
                        value={panelSize}
                        onChange={(event) => handlePanelSizeChange(Number(event.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none font-semibold"
                      >
                        <option value={400}>400W</option>
                        <option value={450}>450W</option>
                        <option value={500}>500W</option>
                        <option value={550}>550W</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center px-4 py-3 bg-white rounded-xl border border-gray-200">
                        <div className="text-xs text-gray-500">Panels Required</div>
                        <div className="text-2xl font-bold text-gray-900">{result ? result.panels : '-'}</div>
                      </div>
                      <div className="text-center px-4 py-3 bg-white rounded-xl border border-gray-200">
                        <div className="text-xs text-gray-500">Total System</div>
                        <div className="text-2xl font-bold text-gray-900">{result ? result.solarKW.toFixed(2) : '-'} kW</div>
                      </div>
                    </div>
                  </div>
                </div>

                {useAppliances && (
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">Load Calculator Summary</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-gray-500">Total Load</div>
                        <div className="font-bold text-gray-900">{totalLoadW.toFixed(0)} W</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-gray-500">Daily Usage</div>
                        <div className="font-bold text-gray-900">{dailyUsageKwh.toFixed(2)} kWh</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-gray-500">Monthly Units</div>
                        <div className="font-bold text-gray-900">{effectiveMonthlyUnits.toFixed(2)} kWh</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-gray-500">Recommended</div>
                        <div className="font-bold text-gray-900">{recommendedKW.toFixed(2)} kW</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <div className="grid sm:grid-cols-3 gap-3 text-center">
                    <div className="bg-white rounded-xl p-4">
                      <div className="text-xs text-gray-500">Monthly Units</div>
                      <div className="text-xl font-bold text-gray-900">{result.monthlyUnits.toFixed(2)}</div>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <div className="text-xs text-gray-500">Daily Units</div>
                      <div className="text-xl font-bold text-gray-900">{result.dailyUnits.toFixed(2)}</div>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <div className="text-xs text-gray-500">Formula</div>
                      <div className="text-xl font-bold text-gray-900">Units / 120</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                  <div className="grid sm:grid-cols-2 gap-3 text-center">
                    <div className="bg-white rounded-xl p-4">
                      <div className="text-xs text-gray-500">Monthly Savings</div>
                      <div className="text-xl font-bold text-green-700">₹{result.monthlySavings.toLocaleString()}</div>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <div className="text-xs text-gray-500">Yearly Savings</div>
                      <div className="text-xl font-bold text-green-700">₹{result.yearlySavings.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGetQuote}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-primary-900 font-bold text-lg rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" /> Get Free Quote
                </button>

                <Link
                  to="/book-inspection"
                  className="block w-full py-4 bg-primary-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all text-center flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5" /> Get Free Inspection
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-2">Ready to switch to solar?</h3>
              <p className="text-white/80 text-lg">Get a free site inspection and personalized quote from our experts</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/quote-request" className="px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:shadow-lg transition-all text-center">Request Quote</Link>
              <Link to="/contact" className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all text-center">Contact Us</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SolarCalculator;