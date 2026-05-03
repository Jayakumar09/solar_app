import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calculator, Sun, Battery, Zap, IndianRupee, Clock, 
  CheckCircle, MapPin, TrendingDown, PiggyBank, RotateCcw, Power,
  ChevronDown, ChevronUp, Loader2, Info
} from 'lucide-react';
import { 
  createInitialRows, calculateAllRows, calculateRowLoad, calculateSolarFromBill,
  getApplianceSummary, getApplianceWattOptions, getDefaultWatt,
  getSolarFactor, APPLIANCE_WATTS
} from '../../utils/loadCalculator';
import api from '../../services/api';

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
  const [includeBattery, setIncludeBattery] = useState(false);
  const [showROI, setShowROI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const calcTimeout = useRef(null);

  function getCorrectSolarKW(monthlyUnits) {
    return monthlyUnits / 120;
  }

  const debouncedCalc = useCallback(() => {
    if (calcTimeout.current) clearTimeout(calcTimeout.current);
    calcTimeout.current = setTimeout(() => {
      if (useApplianceCalc) {
        const city = formData.location || '';
        const res = calculateAllRows(rows, city, includeBattery);
        setLoadResults(res.validRows > 0 ? res : null);
      }
    }, 200);
  }, [rows, useApplianceCalc, formData.location, includeBattery]);

  useEffect(() => {
    debouncedCalc();
  }, [debouncedCalc]);

  useEffect(() => {
    return () => { if (calcTimeout.current) clearTimeout(calcTimeout.current); };
  }, []);

  const calculateSystem = () => {
    let applianceData = null;
    let solarData = null;
    let roiData = null;

    if (useApplianceCalc && loadResults && loadResults.validRows > 0) {
      solarData = {
        recommendedKw: loadResults.recommendedKw,
        solarKw: loadResults.solarKw,
        estimatedCost: loadResults.estimatedCost,
        subsidy: loadResults.subsidy,
        totalCost: loadResults.totalCost,
        monthlySavings: loadResults.monthlySavings,
        yearlySavings: loadResults.yearlySavings,
        paybackYears: loadResults.paybackYears,
        panels: Math.round(loadResults.recommendedKw * 3),
        roiData: loadResults.roiData,
      };
      applianceData = {
        appliances: getApplianceSummary(rows),
        totalLoad: loadResults.totalLoad,
        dailyUnits: loadResults.dailyUnits,
        monthlyUnits: loadResults.monthlyUnits,
        solarKw: loadResults.solarKw,
        solarFactor: loadResults.solarFactor,
        estimatedCost: loadResults.estimatedCost,
      };
      roiData = loadResults.roiData;
    }

    const manualUnits = parseFloat(formData.monthlyUnits) || 0;
    if (!useApplianceCalc && manualUnits <= 0) return;

    setCalculating(true);
    
    setTimeout(() => {
      const city = formData.location || '';
      const solarFactor = getSolarFactor(city);

      if (useApplianceCalc && loadResults) {
        setResults({
          ...solarData,
          monthlyUnits: loadResults.monthlyUnits,
          dailyUnits: loadResults.dailyUnits,
          solarFactor,
          fromApplianceCalc: true,
          applianceData,
          batteryIncluded: loadResults.batteryIncluded,
          batterySize: loadResults.batterySize,
          batteryCost: loadResults.batteryCost,
          roiData,
        });
      } else {
        const billCalc = calculateSolarFromBill(manualUnits);
        setResults({
          ...billCalc,
          solarFactor,
          fromApplianceCalc: false,
          applianceData: null,
          batteryIncluded: false,
          batterySize: 0,
          batteryCost: 0,
          roiData: billCalc.roiData,
        });
      }
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
      if (field === 'name') {
        updated.watt = getDefaultWatt(value);
        updated.isCustomWatt = false;
      }
      if (field === 'watt' && !r.isCustomWatt) {
        updated.isCustomWatt = value === 'other';
        if (value !== 'other') {
          updated.watt = parseInt(value, 10) || 0;
        }
      }
      return updated;
    }));
    setResults(null);
  };

  const resetTable = () => {
    setRows(createInitialRows());
    setLoadResults(null);
    setResults(null);
    setIncludeBattery(false);
  };

  const saveCalculation = async (calcResults) => {
    try {
      const payload = {
        name: '',
        phone: '',
        email: '',
        city: formData.location || '',
        roofType: formData.roofType,
        roofArea: formData.roofArea,
        monthlyUnits: calcResults.monthlyUnits,
        totalLoad: calcResults.applianceData?.totalLoad || 0,
        dailyUnits: calcResults.dailyUnits,
        solarKw: calcResults.recommendedKw,
        solarFactor: calcResults.solarFactor,
        estimatedCost: calcResults.estimatedCost,
        savingsMonthly: calcResults.monthlySavings,
        savingsYearly: calcResults.yearlySavings,
        batteryIncluded: calcResults.batteryIncluded,
        batterySize: calcResults.batterySize || 0,
        batteryCost: calcResults.batteryCost || 0,
        totalCost: calcResults.totalCost,
        paybackYears: calcResults.paybackYears,
        appliances: (calcResults.applianceData?.appliances || []).map(a => ({
          name: a.name,
          watt: a.watt,
          quantity: a.quantity,
          hours: a.hours,
          adjustedLoad: a.adjustedLoad,
        })),
        roiData: calcResults.roiData || [],
      };
      await api.post('/calculator/submit', payload);
    } catch (err) {
      console.warn('Failed to save calculation:', err);
    }
  };

  const handleGetQuote = async () => {
    if (!results) return;
    setSubmitting(true);
    await saveCalculation(results);
    const quoteState = {
      fromCalculator: true,
      monthlyUnits: results.monthlyUnits,
      currentBill: formData.currentBill,
      location: formData.location,
      roofType: formData.roofType,
      roofArea: formData.roofArea,
      solarData: {
        requiredKw: results.recommendedKw,
        estimatedCost: results.estimatedCost,
        monthlySavings: results.monthlySavings,
        yearlySavings: results.yearlySavings,
      },
      applianceData: results.applianceData || null,
      batteryData: results.batteryIncluded ? {
        size: results.batterySize || 0,
        cost: results.batteryCost || 0,
      } : null,
      paybackYears: results.paybackYears,
    };
    setSubmitting(false);
    navigate('/quote-request', { state: quoteState });
  };

  const effectiveMonthlyUnits = useApplianceCalc && loadResults ? loadResults.monthlyUnits : (parseFloat(formData.monthlyUnits) || 0);
  const monthlyUnits = results?.monthlyUnits || effectiveMonthlyUnits;
  const correctKW = getCorrectSolarKW(monthlyUnits);
  const correctPanels = correctKW * 3;
  const correctCost = correctKW * 50000;
  const correctTotalCost = Math.max(correctCost - (results?.subsidy || 0) + (results?.batteryCost || 0), 0);

  const maxROI = results?.roiData ? Math.max(...results.roiData.map(d => d.cumulativeSavings)) : 0;

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
                  value={useApplianceCalc && loadResults ? loadResults.monthlyUnits : formData.monthlyUnits}
                  onChange={(e) => !useApplianceCalc && handleInputChange('monthlyUnits', e.target.value)}
                  placeholder="e.g., 500"
                  readOnly={useApplianceCalc}
                  className={`w-full px-4 py-3 rounded-xl border ${useApplianceCalc ? 'bg-gray-50 border-gray-300' : 'border-gray-200'} focus:ring-2 focus:ring-amber-500 outline-none text-lg`}
                />
                {useApplianceCalc && loadResults ? (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Auto-calculated from appliances</p>
                ) : (
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
                  placeholder="e.g., Mumbai, Chennai, Delhi"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                />
                {formData.location && (
                  <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Sun hours: {getSolarFactor(formData.location)} hrs/day
                  </p>
                )}
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
                      if (!useApplianceCalc) {
                        setTimeout(() => {
                          const res = calculateAllRows(rows, formData.location || '', includeBattery);
                          setLoadResults(res.validRows > 0 ? res : null);
                        }, 100);
                      }
                    }}
                    className={`relative w-14 h-7 rounded-full transition-colors ${useApplianceCalc ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${useApplianceCalc ? 'translate-x-7' : ''}`} />
                  </button>
                </div>

                <AnimatePresence>
                  {useApplianceCalc ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 flex items-center gap-1"><Info className="w-3 h-3" /> Typical watt values are pre-filled for accuracy</p>
                        <button onClick={resetTable} className="text-xs flex items-center gap-1 text-gray-500 hover:text-amber-600 transition-colors">
                          <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                      </div>

                      <div className="overflow-x-auto max-h-72 overflow-y-auto rounded-xl border border-gray-200">
                        <table className="w-full text-sm min-w-[520px]">
                          <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                              <th className="text-left px-2 py-2 font-semibold text-gray-600">Appliance</th>
                              <th className="text-left px-2 py-2 font-semibold text-gray-600">Watt</th>
                              <th className="text-center px-2 py-2 font-semibold text-gray-600 w-14">Qty</th>
                              <th className="text-center px-2 py-2 font-semibold text-gray-600 w-16">Hrs</th>
                              <th className="text-center px-2 py-2 font-semibold text-gray-600 w-12">BLDC</th>
                              <th className="text-right px-2 py-2 font-semibold text-gray-600 w-20">Load</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row) => {
                              const rowLoad = calculateRowLoad(row);
                              const wattOptions = row.name ? getApplianceWattOptions(row.name) : [];
                              const isFan = row.name?.toLowerCase().includes('fan');
                              const hasTooltip = row.name === 'Refrigerator' || row.name === 'Air Conditioner' || row.name === 'Washing Machine';
                              return (
                                <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50">
                                  <td className="px-2 py-1.5">
                                    <input
                                      type="text"
                                      value={row.name}
                                      onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                                      placeholder={row.isOther ? 'Other' : 'Select appliance'}
                                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500 outline-none"
                                    />
                                  </td>
                                  <td className="px-2 py-1.5">
                                    <div className="flex gap-1 items-center">
                                      <select
                                        value={row.isCustomWatt ? 'other' : row.watt}
                                        onChange={(e) => updateRow(row.id, 'watt', e.target.value)}
                                        className="w-16 px-1 py-1 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-500 outline-none"
                                      >
                                        {wattOptions.length > 0 ? (
                                          <>
                                            <option value="">W</option>
                                            {wattOptions.map(w => (
                                              <option key={w} value={w}>{w}W</option>
                                            ))}
                                          </>
                                        ) : (
                                          <option value="">Select</option>
                                        )}
                                        <option value="other">✏️</option>
                                      </select>
                                      {row.isCustomWatt && (
                                        <input
                                          type="number"
                                          min="1"
                                          value={row.isCustomWatt && row.watt ? row.watt : ''}
                                          onChange={(e) => {
                                            const val = parseInt(e.target.value, 10) || 0;
                                            setRows(prev => prev.map(r => r.id === row.id ? { ...r, watt: val } : r));
                                          }}
                                          placeholder="W"
                                          className="w-12 px-1 py-1 text-xs border border-gray-200 rounded-lg outline-none"
                                        />
                                      )}
                                      {hasTooltip && (
                                        <span className="text-gray-400 cursor-help" title={row.name === 'Refrigerator' ? 'Compressor cycles reduce actual usage to ~35%' : row.name === 'Air Conditioner' ? 'Efficiency factor applied: 80% of rated watt' : 'Capped at 2 hrs/day max'}>
                                          <Info className="w-3 h-3" />
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-2 py-1.5">
                                    <input
                                      type="number"
                                      min="1"
                                      value={row.quantity}
                                      onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
                                      className="w-full px-1 py-1 text-xs border border-gray-200 rounded-lg text-center outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                  </td>
                                  <td className="px-2 py-1.5">
                                    <input
                                      type="number"
                                      min="0"
                                      max="24"
                                      step="0.5"
                                      value={row.hours}
                                      onChange={(e) => updateRow(row.id, 'hours', e.target.value)}
                                      className="w-full px-1 py-1 text-xs border border-gray-200 rounded-lg text-center outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                  </td>
                                  <td className="px-2 py-1.5 text-center">
                                    {isFan && (
                                      <input
                                        type="checkbox"
                                        checked={row.isBLDC || false}
                                        onChange={(e) => updateRow(row.id, 'isBLDC', e.target.checked)}
                                        className="w-4 h-4 accent-green-600"
                                        title="BLDC fan (40% less power)"
                                      />
                                    )}
                                  </td>
                                  <td className="px-2 py-1.5 text-right font-medium text-gray-700 text-xs">
                                    {rowLoad > 0 ? `${Math.round(rowLoad)}W` : '-'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <Battery className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-blue-800 font-medium">Include Battery Backup</span>
                        <button
                          onClick={() => { setIncludeBattery(!includeBattery); setResults(null); }}
                          className={`relative w-10 h-5 rounded-full transition-colors ml-auto ${includeBattery ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${includeBattery ? 'translate-x-5' : ''}`} />
                        </button>
                      </div>

                      {loadResults && loadResults.validRows > 0 && (
                        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div>
                              <div className="text-lg font-bold text-green-700">{loadResults.totalLoad}W</div>
                              <div className="text-xs text-green-600">Connected Load</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-700">{loadResults.dailyUnits} units</div>
                              <div className="text-xs text-green-600">Daily</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-700">{loadResults.monthlyUnits} units</div>
                              <div className="text-xs text-green-600">Monthly</div>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-green-200 grid grid-cols-2 gap-3 text-center">
                            <div>
                              <div className="text-lg font-bold text-amber-700">{loadResults.recommendedKw} kW</div>
                              <div className="text-xs text-amber-600">Recommended System</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-700">{loadResults.paybackYears} yr</div>
                              <div className="text-xs text-green-600">Payback</div>
                            </div>
                          </div>
                          {loadResults.batteryIncluded && loadResults.batterySize > 0 && (
                            <div className="mt-3 pt-3 border-t border-green-200 text-center">
                              <span className="text-sm text-blue-700 font-medium">🔋 Battery: {loadResults.batterySize} kWh (+₹{loadResults.batteryCost.toLocaleString()})</span>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <button 
                onClick={calculateSystem}
                disabled={calculating || effectiveMonthlyUnits <= 0}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-primary-900 font-bold text-lg rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {calculating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Calculating...</>
                ) : (
                  <><Calculator className="w-5 h-5" /> Calculate Savings</>
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

                <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">Recommended system is based on your actual usage (Monthly Units / 120)</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-5 text-center">
                    <div className="text-4xl font-bold text-primary-900 mb-1">{correctKW.toFixed(2)}</div>
                    <div className="text-sm font-semibold text-primary-800">kW Recommended</div>
                  </div>
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 text-center">
                    <div className="text-4xl font-bold text-white mb-1">{Math.round(correctPanels)}</div>
                    <div className="text-sm font-semibold text-white/80">Panels (550W)</div>
                  </div>
                </div>

                {results.fromApplianceCalc && results.applianceData && (
                  <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Load Calculator Summary</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-xs text-gray-500">Connected Load</div>
                        <div className="font-bold text-gray-900">{results.applianceData.totalLoad} W</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-xs text-gray-500">Daily Usage</div>
                        <div className="font-bold text-gray-900">{results.dailyUnits} units</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-xs text-gray-500">Monthly Units</div>
                        <div className="font-bold text-gray-900">{results.monthlyUnits} units</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-xs text-gray-500">Sun Hours</div>
                        <div className="font-bold text-green-700">{results.solarFactor} hrs/day</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <PiggyBank className="w-6 h-6 text-green-600" />
                    <span className="font-bold text-green-800 text-lg">Monthly Savings</span>
                  </div>
                  <div className="text-4xl font-bold text-green-700">₹{results.monthlySavings.toLocaleString()}/mo</div>
                  <div className="text-sm text-green-600 mt-1">₹{results.yearlySavings.toLocaleString()}/year</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <IndianRupee className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">System Cost</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">₹{Math.round(correctCost).toLocaleString()}</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-500">PM Surya Subsidy</span>
                    </div>
                    <div className="text-xl font-bold text-green-600">-₹{results.subsidy.toLocaleString()}</div>
                  </div>
                </div>

                {results.batteryIncluded && results.batterySize > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Battery className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-blue-700 font-medium">Battery Backup</span>
                    </div>
                    <div className="text-lg font-bold text-blue-800">{results.batterySize} kWh (+₹{results.batteryCost.toLocaleString()})</div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80">Final Cost After Subsidy</span>
                    <Clock className="w-5 h-5 text-white/80" />
                  </div>
                  <div className="text-3xl font-bold">₹{Math.round(correctTotalCost).toLocaleString()}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span className="text-sm text-gray-500">Payback Period</span>
                    </div>
                    <div className="text-xl font-bold text-amber-700">{results.paybackYears} Years</div>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-gray-500">Efficiency</span>
                    </div>
                    <div className="text-xl font-bold text-emerald-700">{results.monthlyUnits > 300 ? 'High' : results.monthlyUnits > 150 ? 'Medium' : 'Standard'}</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowROI(!showROI)}
                  className="w-full py-3 border-2 border-green-200 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                >
                  <TrendingDown className="w-4 h-4" />
                  {showROI ? 'Hide' : 'View'} ROI Analysis
                  {showROI ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <AnimatePresence>
                  {showROI && results.roiData && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 text-green-600" />
                          Investment vs Savings (25 Years)
                        </h3>
                        <div className="space-y-1">
                          {results.roiData.filter((_, i) => i % 5 === 0).map((d) => {
                            const pct = maxROI > 0 ? (d.cumulativeSavings / maxROI * 100) : 0;
                            const netPct = maxROI > 0 ? (Math.max(d.netValue, 0) / maxROI * 100) : 0;
                            const breakEven = d.netValue >= 0;
                            return (
                              <div key={d.year} className="flex items-center gap-2 text-xs">
                                <span className="w-8 text-gray-500 font-medium">Yr {d.year}</span>
                                <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden relative">
                                  <div className="h-full bg-blue-400 transition-all duration-500 rounded-full" style={{ width: `${pct}%` }} />
                                  {breakEven && <div className="h-full absolute top-0 bg-green-500 transition-all duration-500 rounded-full opacity-60" style={{ width: `${netPct}%` }} />}
                                </div>
                                <span className={`w-24 text-right font-semibold ${breakEven ? 'text-green-600' : 'text-red-500'}`}>
                                  ₹{(d.netValue / 100000).toFixed(1)}L
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-400 rounded inline-block" /> Savings</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded inline-block opacity-60" /> Net Value</span>
                          <span className="ml-auto">Break-even: Year {results.paybackYears}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleGetQuote}
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-primary-900 font-bold text-lg rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><CheckCircle className="w-5 h-5" /> Get Free Quote</>}
                </button>

                <Link 
                  to="/book-inspection"
                  className="block w-full py-4 bg-primary-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all text-center flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5" /> Get Free Inspection
                </Link>

                <p className="text-xs text-center text-gray-500">*Based on standard solar calculations for India. Actual results may vary based on site conditions.</p>
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
