import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calculator, Sun, Battery, Zap, IndianRupee, Clock, 
  ArrowRight, CheckCircle, MapPin, Home, ChevronDown,
  Loader2, Leaf, TrendingDown, PiggyBank
} from 'lucide-react';

const SolarCalculator = () => {
  const [formData, setFormData] = useState({
    monthlyUnits: '',
    currentBill: '',
    roofType: 'concrete',
    roofArea: '',
    location: '',
  });
  const [results, setResults] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const calculateSystem = () => {
    const units = parseFloat(formData.monthlyUnits) || 0;
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
      
      const monthlySavings = (units * 8).toFixed(0);
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
        monthlySavings,
        annualSavings,
        paybackYears,
        batteryNeeded,
        batteryCost,
        efficiency: units > 300 ? 'High' : units > 150 ? 'Medium' : 'Standard',
      });
      setCalculating(false);
    }, 800);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setResults(null);
  };

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
                  value={formData.monthlyUnits}
                  onChange={(e) => handleInputChange('monthlyUnits', e.target.value)}
                  placeholder="e.g., 500"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none text-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Check your electricity bill for monthly units consumed</p>
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

              <button 
                onClick={calculateSystem}
                disabled={calculating || !formData.monthlyUnits}
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

                <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <PiggyBank className="w-6 h-6 text-green-600" />
                    <span className="font-bold text-green-800 text-lg">Monthly Savings</span>
                  </div>
                  <div className="text-4xl font-bold text-green-700">₹{results.monthlySavings}/month</div>
                  <div className="text-sm text-green-600 mt-1">₹{results.annualSavings}/year</div>
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

                <Link 
                  to="/book-inspection"
                  className="block w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-primary-900 font-bold text-lg rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all text-center flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" /> Get Free Inspection
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