import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calculator, Sun, Battery, Zap, IndianRupee, Clock, 
  ArrowRight, CheckCircle, MapPin, Home, ChevronDown,
  Loader2, Leaf, TrendingDown, PiggyBank, Plus, X, RotateCcw, Power
} from 'lucide-react';
import { 
  createInitialRows, calculateAllRows, getWattForRow, calculateRowLoad,
  getApplianceSummary, WATT_OPTIONS, COST_PER_KW, EB_RATE_PER_UNIT
} from '../../utils/loadCalculator';

const SolarCalculator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    monthlyUnits: '',
    currentBill: '',
    roofType: 'concrete',
    roofArea: '',
    location: '',
  });
  const [results, setResults] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const [useApplianceCalc, setUseApplianceCalc] = useState(false);
  const [rows, setRows] = useState(createInitialRows);
  const [loadResults, setLoadResults] = useState(null);
  const calcTimeout = useRef(null);

  const debouncedCalc = useCallback(() => {
    if (calcTimeout.current) clearTimeout(calcTimeout.current);
    calcTimeout.current = setTimeout(() => {
      if (useApplianceCalc) {
        const res = calculateAllRows(rows);
        setLoadResults(res.validRows > 0 ? res : null);
      }
    }, 200);
  }, [rows, useApplianceCalc]);

  useEffect(() => {
    debouncedCalc();
  }, [debouncedCalc]);

  useEffect(() => {
    return () => { if (calcTimeout.current) clearTimeout(calcTimeout.current); };
  }, []);

  const calculateSystem = () => {
    let units = parseFloat(formData.monthlyUnits) || 0;
    let applianceData = null;
    let solarData = null;

    if (useApplianceCalc && loadResults && loadResults.validRows > 0) {
      units = loadResults.monthlyUnits;
      applianceData = {
        appliances: getApplianceSummary(rows),
        totalLoad: loadResults.totalLoad,
        dailyUnits: loadResults.dailyUnits,
        monthlyUnits: loadResults.monthlyUnits,
        solarSize: loadResults.requiredKw,
        estimatedCost: loadResults.estimatedCost,
      };
      solarData = {
        requiredKw: loadResults.requiredKw,
        estimatedCost: loadResults.estimatedCost,
        monthlySavings: loadResults.monthlySavings,
        yearlySavings: loadResults.yearlySavings,
      };
    }

    if (units <= 0) return;

    setCalculating(true);
    
    setTimeout(() => {
      const dailyUnits = units / 30;
      const systemKw = (dailyUnits * 1.2).toFixed(2);
      const panelWatts = 550;
      const panels = Math.ceil((systemKw * 1000) / panelWatts);
      
      const costPerKw = units > 500 ? 45000 : units > 300 ? 50000 : 55000;
      const systemCost = Math.round(systemKw * costPerKw);
      
      const subsidy = systemCost * 0.4;
      const finalCost = systemCost - subsidy;
      
      const monthlySavings = solarData ? solarData.monthlySavings : (units * 8).toFixed(0);
      const annualSavings = monthlySavings * 12;
      const paybackYears = (finalCost / annualSavings).toFixed(1);
      
      const batteryNeeded = dailyUnits > 10 ? '10kWh' : dailyUnits > 5 ? '5kWh' : '3kWh';
      const batteryCost = batteryNeeded === '10kWh' ? 150000 : batteryNeeded === '5kWh' ? 80000 : 50000;

      setResults({
        systemKw,
        panels,
        systemCost,
        subsidy,
        finalCost,
        monthlySavings: Number(monthlySavings),
        annualSavings,
        paybackYears,
        batteryNeeded,
        batteryCost,
        efficiency: units > 300 ? 'High' : units > 150 ? 'Medium' : 'Standard',
        fromApplianceCalc: useApplianceCalc && loadResults?.validRows > 0,
        applianceData,
        solarData,
        dailyUnits: Math.round(dailyUnits * 100) / 100,
        monthlyUnits: Math.round(units * 100) / 100,
      });
      setCalculating(false);
    }, 800);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setResults(null);
  };

  const updateRow = (id, field, value) => {
    setRows(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: value };
      if (field === 'wattDropdown' && value !== 'other') {
        updated.customWatt = '';
      }
      return updated;
    }));
    setResults(null);
  };

  const resetTable = () => {
    setRows(createInitialRows());
    setLoadResults(null);
    setResults(null);
  };

  const handleGetQuote = () => {
    if (!results) return;
    const quoteState = {
      fromCalculator: true,
      monthlyUnits: results.monthlyUnits,
      currentBill: formData.currentBill,
      location: formData.location,
      roofType: formData.roofType,
      roofArea: formData.roofArea,
      solarData: results.solarData || {
        requiredKw: parseFloat(results.systemKw),
        estimatedCost: results.systemCost,
        monthlySavings: results.monthlySavings,
        yearlySavings: results.annualSavings,
      },
      applianceData: results.applianceData || null,
    };
    navigate('/quote-request', { state: quoteState });
  };

  const effectiveMonthlyUnits = useApplianceCalc && loadResults ? loadResults.monthlyUnits : (parseFloat(formData.monthlyUnits) || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Calculator className="w-8 h-8 text-primary-900" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Solar Calculator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Calculate your savings and find the perfect solar system for your needs</p>
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
                  value={useApplianceCalc && loadResults ? loadResults.monthlyUnits.toFixed(1) : formData.monthlyUnits}
                  onChange={(e) => !useApplianceCalc && handleInputChange('monthlyUnits', e.target.value)}
                  placeholder="e.g., 500"
                  readOnly={useApplianceCalc}
                  className={`w-full px-4 py-3 rounded-xl border ${useApplianceCalc ? 'bg-gray-50 border-gray-300 cursor-not-allowed' : 'border-gray-200'} focus:ring-2 focus:ring-amber-500 outline-none text-lg`}
                />
                {useApplianceCalc && loadResults && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><Zap className="w-3 h-3" />Auto-calculated from appliances</p>
                )}
                {!useApplianceCalc && (
                  <p className="text-xs text-gray-500 mt-1">Check your electricity bill for monthly units consumed</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Electricity Bill (₹)</label>
                <input 
                  type="number" 
                  value={formData.currentBill}
                  onChange={(e) => handleInputChange('currentBill', e.target.value)}
                  placeholder="e.g., 5000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none text-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Roof Type</label>
                  <select 
                    value={formData.roofType}
                    onChange={(e) => handleInputChange('roofType', e.target.value)}
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
                    value={formData.roofArea}
                    onChange={(e) => handleInputChange('roofArea', e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location (City)</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Mumbai, Pune, Nashik"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Power className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">Smart Load Calculator</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Optional</span>
                  </div>
                  <button
                    onClick={() => {
                      setUseApplianceCalc(!useApplianceCalc);
                      setResults(null);
                      if (!useApplianceCalc && !loadResults) {
                        setTimeout(() => {
                          const res = calculateAllRows(rows);
                          setLoadResults(res.validRows > 0 ? res : null);
                        }, 100);
                      }
                    }}
                    className={`relative w-14 h-7 rounded-full transition-colors ${useApplianceCalc ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${useApplianceCalc ? 'translate-x-7' : ''}`} />
                  </button>
                </div>

                {useApplianceCalc && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">Select appliances and set usage to auto-calculate your load</p>
                      <button onClick={resetTable} className="text-xs flex items-center gap-1 text-gray-500 hover:text-amber-600 transition-colors">
                        <RotateCcw className="w-3 h-3" /> Reset
                      </button>
                    </div>

                    <div className="overflow-x-auto max-h-80 overflow-y-auto rounded-xl border border-gray-200">
                      <table className="w-full text-sm min-w-[500px]">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            <th className="text-left px-3 py-2 font-semibold text-gray-600">Appliance</th>
                            <th className="text-left px-3 py-2 font-semibold text-gray-600">Watt</th>
                            <th className="text-center px-3 py-2 font-semibold text-gray-600 w-16">Qty</th>
                            <th className="text-center px-3 py-2 font-semibold text-gray-600 w-20">Hrs/Day</th>
                            <th className="text-right px-3 py-2 font-semibold text-gray-600 w-20">Load (W)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row) => {
                            const rowLoad = calculateRowLoad(row);
                            return (
                              <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-2">
                                  <input
                                    type="text"
                                    value={row.name}
                                    onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                                    placeholder={row.isOther ? 'Other Appliance' : row.name}
                                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500 outline-none"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <div className="flex gap-1">
                                    <select
                                      value={row.wattDropdown}
                                      onChange={(e) => updateRow(row.id, 'wattDropdown', e.target.value)}
                                      className="w-20 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500 outline-none"
                                    >
                                      <option value="">Select</option>
                                      {WATT_OPTIONS.map(w => (
                                        <option key={w} value={w}>{w}W</option>
                                      ))}
                                      <option value="other">Other</option>
                                    </select>
                                    {row.wattDropdown === 'other' && (
                                      <input
                                        type="number"
                                        value={row.customWatt}
                                        onChange={(e) => updateRow(row.id, 'customWatt', e.target.value)}
                                        placeholder="W"
                                        className="w-16 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500 outline-none"
                                      />
                                    )}
                                  </div>
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    min="1"
                                    value={row.quantity}
                                    onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
                                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg text-center focus:ring-1 focus:ring-amber-500 outline-none"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input
                                    type="number"
                                    min="0"
                                    max="24"
                                    step="0.5"
                                    value={row.hours}
                                    onChange={(e) => updateRow(row.id, 'hours', e.target.value)}
                                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg text-center focus:ring-1 focus:ring-amber-500 outline-none"
                                  />
                                </td>
                                <td className="px-3 py-2 text-right font-medium text-gray-700">
                                  {rowLoad > 0 ? rowLoad : '-'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {loadResults && loadResults.validRows > 0 && (
                      <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div>
                            <div className="text-lg font-bold text-green-700">{loadResults.totalLoad}W</div>
                            <div className="text-xs text-green-600">Total Load</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-700">{loadResults.dailyUnits} kWh</div>
                            <div className="text-xs text-green-600">Daily</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-700">{loadResults.monthlyUnits} kWh</div>
                            <div className="text-xs text-green-600">Monthly</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              <button 
                onClick={calculateSystem}
                disabled={calculating || effectiveMonthlyUnits <= 0}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-primary-900 font-bold text-lg rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {calculating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" /> Calculate Savings
                  </>
                )}
              </button>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-3xl p-8 shadow-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {!results ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-gray-400">
                <Sun className="w-20 h-20 mb-4 opacity-30" />
                <p className="text-lg font-medium">Enter your details to see results</p>
                <p className="text-sm">Get instant savings calculation</p>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-green-500" /> Your Solar Report
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-5 text-center">
                    <div className="text-4xl font-bold text-primary-900 mb-1">{results.systemKw}</div>
                    <div className="text-sm font-semibold text-primary-800">kW System</div>
                  </div>
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 text-center">
                    <div className="text-4xl font-bold text-white mb-1">{results.panels}</div>
                    <div className="text-sm font-semibold text-white/80">Panels</div>
                  </div>
                </div>

                {results.fromApplianceCalc && results.solarData && (
                  <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Load Calculator Summary</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-xs text-gray-500">Total Load</div>
                        <div className="font-bold text-gray-900">{results.applianceData?.totalLoad || '-'} W</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-xs text-gray-500">Daily Usage</div>
                        <div className="font-bold text-gray-900">{results.dailyUnits} kWh</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-xs text-gray-500">Monthly Units</div>
                        <div className="font-bold text-gray-900">{results.monthlyUnits} kWh</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-xs text-gray-500">Recommended</div>
                        <div className="font-bold text-green-700">{results.solarData.requiredKw} kW</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <PiggyBank className="w-6 h-6 text-green-600" />
                    <span className="font-bold text-green-800 text-lg">Monthly Savings</span>
                  </div>
                  <div className="text-4xl font-bold text-green-700">₹{results.monthlySavings.toLocaleString()}/month</div>
                  <div className="text-sm text-green-600 mt-1">₹{results.annualSavings.toLocaleString()}/year</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <IndianRupee className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">System Cost</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">₹{results.systemCost.toLocaleString()}</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-500">Govt Subsidy (40%)</span>
                    </div>
                    <div className="text-xl font-bold text-green-600">-₹{results.subsidy.toLocaleString()}</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80">Final Cost After Subsidy</span>
                    <Clock className="w-5 h-5 text-white/80" />
                  </div>
                  <div className="text-3xl font-bold">₹{results.finalCost.toLocaleString()}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span className="text-sm text-gray-500">Payback Period</span>
                    </div>
                    <div className="text-xl font-bold text-amber-700">{results.paybackYears} Years</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Battery className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-500">Battery (Optional)</span>
                    </div>
                    <div className="text-xl font-bold text-blue-700">{results.batteryNeeded}</div>
                    <div className="text-xs text-blue-600">+₹{results.batteryCost.toLocaleString()}</div>
                  </div>
                </div>

                <button
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

                <p className="text-xs text-center text-gray-500">*Based on standard solar calculations. Actual results may vary based on site conditions.</p>
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
              <Link 
                to="/quote-request" 
                className="px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:shadow-lg transition-all text-center"
              >
                Request Quote
              </Link>
              <Link 
                to="/contact"
                className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SolarCalculator;
