import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calculator,
  CheckCircle,
  Loader2,
  MapPin,
  RotateCcw,
  Sun,
  Zap,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const emptyRow = (id) => ({
  id,
  name: '',
  watt: '',
  quantity: '1',
  hours: '',
});

const initialRows = () => [
  { ...emptyRow(1), name: 'Light', watt: '20', quantity: '6', hours: '6' },
  { ...emptyRow(2), name: 'Fan', watt: '75', quantity: '4', hours: '8' },
  { ...emptyRow(3), name: 'TV', watt: '120', quantity: '1', hours: '4' },
  { ...emptyRow(4), name: 'Refrigerator', watt: '200', quantity: '1', hours: '8' },
  emptyRow(5),
];

const toPositiveNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
};

const getApplianceMonthlyUnits = (rows) => {
  const dailyUnits = rows.reduce((total, row) => {
    const watt = toPositiveNumber(row.watt);
    const quantity = toPositiveNumber(row.quantity);
    const hours = toPositiveNumber(row.hours);
    return total + (watt * quantity * hours) / 1000;
  }, 0);

  return dailyUnits * 30;
};

const getAppliancePayload = (rows) => rows
  .filter((row) => toPositiveNumber(row.watt) > 0 && toPositiveNumber(row.quantity) > 0 && toPositiveNumber(row.hours) > 0)
  .map((row) => ({
    name: row.name,
    watt: toPositiveNumber(row.watt),
    quantity: toPositiveNumber(row.quantity),
    hours: toPositiveNumber(row.hours),
  }));

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
  const [calculating, setCalculating] = useState(false);

  const applianceMonthlyUnits = useMemo(() => getApplianceMonthlyUnits(rows), [rows]);
  const activeMonthlyUnits = useAppliances
    ? applianceMonthlyUnits
    : toPositiveNumber(monthlyUnitsInput);

  const updateRow = (id, field, value) => {
    setRows((currentRows) => currentRows.map((row) => (
      row.id === id ? { ...row, [field]: value } : row
    )));
    setResult(null);
  };

  const addRow = () => {
    setRows((currentRows) => [...currentRows, emptyRow(Date.now())]);
    setResult(null);
  };

  const resetRows = () => {
    setRows(initialRows());
    setResult(null);
  };

  const calculateSystem = async () => {
    let units = toPositiveNumber(monthlyUnitsInput);

    if (units <= 0) {
      const bill = toPositiveNumber(currentBill);
      if (bill > 0) {
        units = bill / 8;
      }
    }

    if (useAppliances) {
      units = applianceMonthlyUnits;
    }

    if (units <= 0) {
      return;
    }

    setCalculating(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/v2/solar/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          monthlyUnits: units,
          appliances: useAppliances ? getAppliancePayload(rows) : [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Solar calculation failed with ${response.status}`);
      }

      const data = await response.json();
      console.log('NEW CALC ACTIVE', data);
      setResult(data);
    } catch (error) {
      console.error('Solar calculation failed:', error);
    } finally {
      setCalculating(false);
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
          appliances: getAppliancePayload(rows),
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

        <div className="grid lg:grid-cols-2 gap-8">
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
                  min="0"
                  value={useAppliances ? applianceMonthlyUnits.toFixed(2) : monthlyUnitsInput}
                  onChange={(event) => {
                    setMonthlyUnitsInput(event.target.value);
                    setResult(null);
                  }}
                  placeholder="e.g., 600"
                  readOnly={useAppliances}
                  className={`w-full px-4 py-3 rounded-xl border ${useAppliances ? 'bg-gray-50 border-gray-300' : 'border-gray-200'} focus:ring-2 focus:ring-amber-500 outline-none text-lg`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {useAppliances ? 'Calculated from appliance rows below' : 'Enter the monthly units from your electricity bill'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Electricity Bill (Rs)</label>
                <input
                  type="number"
                  min="0"
                  value={currentBill}
                  onChange={(event) => setCurrentBill(event.target.value)}
                  placeholder="e.g., 5000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none text-lg"
                />
              </div>

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

                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="w-full min-w-[560px] text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-3 py-2 font-semibold text-gray-600">Appliance</th>
                            <th className="text-left px-3 py-2 font-semibold text-gray-600">Watt</th>
                            <th className="text-left px-3 py-2 font-semibold text-gray-600">Qty</th>
                            <th className="text-left px-3 py-2 font-semibold text-gray-600">Hours/day</th>
                            <th className="text-right px-3 py-2 font-semibold text-gray-600">Units/month</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row) => {
                            const rowUnits = (toPositiveNumber(row.watt) * toPositiveNumber(row.quantity) * toPositiveNumber(row.hours) * 30) / 1000;
                            return (
                              <tr key={row.id} className="border-t border-gray-100">
                                <td className="px-3 py-2">
                                  <input
                                    type="text"
                                    value={row.name}
                                    onChange={(event) => updateRow(row.id, 'name', event.target.value)}
                                    className="w-full px-2 py-2 rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-amber-500"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    min="0"
                                    value={row.watt}
                                    onChange={(event) => updateRow(row.id, 'watt', event.target.value)}
                                    className="w-full px-2 py-2 rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-amber-500"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    min="0"
                                    value={row.quantity}
                                    onChange={(event) => updateRow(row.id, 'quantity', event.target.value)}
                                    className="w-full px-2 py-2 rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-amber-500"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    min="0"
                                    max="24"
                                    step="0.5"
                                    value={row.hours}
                                    onChange={(event) => updateRow(row.id, 'hours', event.target.value)}
                                    className="w-full px-2 py-2 rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-amber-500"
                                  />
                                </td>
                                <td className="px-3 py-2 text-right font-semibold text-gray-700">{rowUnits.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
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
                disabled={calculating || activeMonthlyUnits <= 0}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-primary-900 font-bold text-lg rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {calculating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Calculating...</>
                ) : (
                  <><Calculator className="w-5 h-5" /> Calculate Solar</>
                )}
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
                <p className="text-sm">New calculator uses Monthly Units / 120</p>
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
                    <div className="text-4xl font-bold text-white mb-1">{Math.round(result.panels)}</div>
                    <div className="text-sm font-semibold text-white/80">Panels Approx</div>
                  </div>
                </div>

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

                 {result.monthlySavings > 0 && (
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
                 )}

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
