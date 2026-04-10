import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';
import {
  Calculator, Sun, Battery, Zap, Save, FileText, Download, Trash2,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Loader2,
  Users, Building, Home, Plug, DollarSign, Clock, TrendingUp,
  Leaf, Shield, Truck, Wrench, Percent, X, Link2, Send
} from 'lucide-react';

const PanelWattages = [330, 400, 450, 500, 550, 600];
const InverterTypes = [
  { value: 'ongrid', label: 'On-Grid (Grid Tied)' },
  { value: 'hybrid', label: 'Hybrid (Grid + Battery)' },
  { value: 'offgrid', label: 'Off-Grid (Battery Only)' },
];
const RoofTypes = ['concrete', 'tin', 'tiled', 'flat', 'metal'];
const ConnectionTypes = ['residential', 'commercial'];
const PhaseTypes = ['single', 'three'];
const InstallationTypes = ['rooftop', 'ground'];
const IndianCities = [
  'Mumbai', 'Pune', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Ahmedabad', 'Nagpur', 'Surat', 'Jaipur', 'Lucknow',
  'Kanpur', 'Indore', 'Coimbatore', 'Kochi', 'Patna', 'Bhopal'
];

const fmt = (n) => {
  const v = Number(n || 0);
  return v.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
};
const fmtKw = (n) => Number(n || 0).toFixed(2);

const InputField = ({ label, icon: Icon, children, required, hint }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
      {Icon && <Icon className="w-4 h-4 text-amber-500" />}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-500">{hint}</p>}
  </div>
);

const SectionCard = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary-900" />
          </div>
          <span className="font-bold text-gray-900 text-lg">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 pb-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AdminCalculator() {
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [results, setResults] = useState(null);
  const [inputs, setInputs] = useState({
    leadId: '',
    monthlyUnits: '',
    monthlyBill: '',
    roofType: 'concrete',
    roofArea: '',
    city: 'Mumbai',
    connectionType: 'residential',
    phaseType: 'single',
    panelWattage: 550,
    inverterType: 'ongrid',
    batteryRequired: false,
    backupHours: 0,
    subsidyEligible: true,
    shadowLossPercent: 5,
    installationType: 'rooftop',
    structureCost: '',
    wiringCost: '',
    laborCost: '',
    amcIncluded: false,
    discountPercent: 0,
    profitMarginPercent: 10,
  });
  const [errors, setErrors] = useState({});
  const [savedCalcs, setSavedCalcs] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => { 
    loadLeads(); 
    loadSavedCalcs();
  }, []);

  const loadLeads = async () => {
    try {
      const res = await api.get('/leads');
      setLeads(res.data?.leads || res.data || []);
    } catch { 
      setLeads([]); 
    } finally {
      setLoadingLeads(false);
    }
  };

  const loadSavedCalcs = async () => {
    setLoadingSaved(true);
    setLoadError(null);
    try {
      const res = await api.get('/calculator');
      setSavedCalcs(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      setSavedCalcs([]);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleInputChange = useCallback((field, value) => {
    const safeValue = value === '' ? '' : (Number.isNaN(Number(value)) ? '' : Number(value));
    setInputs(prev => ({ ...prev, [field]: safeValue }));
    setErrors(prev => ({ ...prev, [field]: null }));
    setResults(null);
  }, []);

  const validateInputs = () => {
    const newErrors = {};
    const monthlyUnitsVal = Number(inputs.monthlyUnits) || 0;
    const monthlyBillVal = Number(inputs.monthlyBill) || 0;
    const roofAreaVal = Number(inputs.roofArea) || 0;
    const backupHoursVal = Number(inputs.backupHours) || 0;
    
    if (!monthlyUnitsVal && !monthlyBillVal) {
      newErrors.monthlyUnits = 'Monthly Units or Monthly Bill is required';
    }
    if (roofAreaVal > 0 && roofAreaVal < 50) {
      newErrors.roofArea = 'Roof area should be at least 50 sq ft';
    }
    if (inputs.batteryRequired && (!backupHoursVal || backupHoursVal < 1)) {
      newErrors.backupHours = 'Backup hours required when battery is selected';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateSystem = async () => {
    if (!validateInputs()) {
      toast.error('Please fix validation errors');
      return;
    }
    setCalculating(true);
    try {
      const res = await api.post('/calculator/calculate', inputs);
      setResults(res.data?.data?.results);
      toast.success('Calculation complete');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Calculation failed');
    }
    setCalculating(false);
  };

  const saveCalculation = async () => {
    if (!results) return;
    try {
      await api.post('/calculator/save', {
        leadId: inputs.leadId || null,
        inputs,
        results,
        notes: '',
      });
      toast.success('Calculation saved');
      loadSavedCalcs();
    } catch { toast.error('Failed to save'); }
  };

  const deleteCalc = async (id) => {
    try {
      await api.delete(`/calculator/${id}`);
      toast.success('Deleted');
      loadSavedCalcs();
    } catch { toast.error('Failed to delete'); }
  };

  const convertToQuote = async (calcId) => {
    try {
      await api.post('/calculator/convert-to-quote', { calcId });
      toast.success('Converted to quote');
    } catch { toast.error('Failed to convert'); }
  };

  const exportProposal = () => {
    if (!results) return;
    const proposalData = {
      customer: leads.find(l => l.id === inputs.leadId),
      inputs,
      results,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(proposalData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proposal_${inputs.city}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedLead = useMemo(() => leads.find(l => l.id === inputs.leadId), [leads, inputs.leadId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div className="flex items-center justify-between mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-primary-900" />
              </div>
              Solar Engineering Calculator
            </h1>
            <p className="text-gray-500 mt-1">Professional solar system sizing and cost estimation tool</p>
          </div>
          <button onClick={() => setShowSaved(!showSaved)} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-card hover:shadow-lg transition-all">
            <FileText className="w-5 h-5 text-amber-500" />
            Saved ({savedCalcs.length})
          </button>
        </motion.div>

        <AnimatePresence>
          {showSaved && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6">
              <div className="bg-white rounded-2xl shadow-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Saved Calculations</h3>
                  <button onClick={() => setShowSaved(false)}><X className="w-5 h-5" /></button>
                </div>
                {loadingSaved ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                    <span className="ml-2 text-gray-500">Loading...</span>
                  </div>
                ) : loadError ? (
                  <div className="text-center py-4">
                    <p className="text-red-500 text-sm">{loadError}</p>
                    <button onClick={loadSavedCalcs} className="text-amber-600 text-sm underline mt-1">Retry</button>
                  </div>
                ) : savedCalcs.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No saved calculations yet. Complete a calculation and click Save.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {savedCalcs.map(calc => {
                      const parsedInputs = typeof calc.inputs === 'string' ? JSON.parse(calc.inputs) : (calc.inputs || {});
                      const parsedResults = typeof calc.results === 'string' ? JSON.parse(calc.results) : (calc.results || {});
                      const sysKw = parsedResults?.systemSizeKw || parsedResults?.recommendedSystemSizeKw || parsedInputs?.systemSizeKw || 0;
                      const city = parsedInputs?.city || calc.city || '-';
                      const connType = parsedInputs?.connectionType || calc.connection_type || parsedInputs?.connectionType || '-';
                      const finalPrice = parsedResults?.finalPrice || parsedResults?.finalSellingPrice || 0;
                      return (
                        <div key={calc.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-900">{sysKw} kW System</p>
                              <p className="text-sm text-gray-500">{city} | {connType}</p>
                              <p className="text-xs text-gray-400 mt-1">₹{fmt(finalPrice)}</p>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => convertToQuote(calc.id)} title="Convert to Quote" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Send className="w-4 h-4" />
                              </button>
                              <button onClick={() => deleteCalc(calc.id)} title="Delete" className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <SectionCard title="Customer & Location" icon={Users} defaultOpen={true}>
              <div className="md:col-span-2">
                <InputField label="Link to Lead/Customer" icon={Link2}>
                  <select
                    value={inputs.leadId}
                    onChange={e => handleInputChange('leadId', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="">-- Select Lead/Customer --</option>
                    {leads.map(lead => (
                      <option key={lead.id} value={lead.id}>{lead.name} ({lead.phone})</option>
                    ))}
                  </select>
                </InputField>
                {selectedLead && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-xl text-sm">
                    <p className="font-semibold text-blue-900">{selectedLead.name}</p>
                    <p className="text-blue-700">{selectedLead.email} | {selectedLead.phone}</p>
                    <p className="text-blue-600">{selectedLead.city}, {selectedLead.state}</p>
                  </div>
                )}
              </div>
              <InputField label="City/Location" icon={Building} required>
                <select
                  value={inputs.city}
                  onChange={e => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {IndianCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </InputField>
              <InputField label="Connection Type" icon={Plug}>
                <select
                  value={inputs.connectionType}
                  onChange={e => handleInputChange('connectionType', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {ConnectionTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </InputField>
              <InputField label="Phase Type" icon={Zap}>
                <select
                  value={inputs.phaseType}
                  onChange={e => handleInputChange('phaseType', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {PhaseTypes.map(phase => (
                    <option key={phase} value={phase}>{phase === 'single' ? 'Single Phase' : 'Three Phase'}</option>
                  ))}
                </select>
              </InputField>
            </SectionCard>

            <SectionCard title="Consumption Details" icon={Zap} defaultOpen={true}>
              <InputField label="Monthly Units (kWh)" icon={Zap} required hint="Total electricity consumption per month">
                <input
                  type="number"
                  value={inputs.monthlyUnits}
                  onChange={e => handleInputChange('monthlyUnits', e.target.value)}
                  placeholder="e.g., 500"
                  className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-amber-500 outline-none ${errors.monthlyUnits ? 'border-red-300' : 'border-gray-200'}`}
                />
              </InputField>
              <InputField label="Monthly Bill (₹)" hint="Current electricity bill amount">
                <input
                  type="number"
                  value={inputs.monthlyBill}
                  onChange={e => handleInputChange('monthlyBill', e.target.value)}
                  placeholder="e.g., 4000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </InputField>
              <InputField label="Roof Type" icon={Home}>
                <select
                  value={inputs.roofType}
                  onChange={e => handleInputChange('roofType', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {RoofTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </InputField>
              <InputField label="Roof Area (sq ft)" hint="Available roof area for panels">
                <input
                  type="number"
                  value={inputs.roofArea}
                  onChange={e => handleInputChange('roofArea', e.target.value)}
                  placeholder="e.g., 300"
                  className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-amber-500 outline-none ${errors.roofArea ? 'border-red-300' : 'border-gray-200'}`}
                />
              </InputField>
              <InputField label="Installation Type" icon={Home}>
                <select
                  value={inputs.installationType}
                  onChange={e => handleInputChange('installationType', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {InstallationTypes.map(type => (
                    <option key={type} value={type}>{type === 'rooftop' ? 'Rooftop' : 'Ground Mounted'}</option>
                  ))}
                </select>
              </InputField>
              <InputField label="Shadow Loss (%)" hint="Estimated loss due to shadows">
                <input
                  type="number"
                  value={inputs.shadowLossPercent}
                  onChange={e => handleInputChange('shadowLossPercent', e.target.value)}
                  min="0" max="50"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </InputField>
            </SectionCard>

            <SectionCard title="Equipment Selection" icon={Sun}>
              <InputField label="Panel Wattage" icon={Sun} required>
                <select
                  value={inputs.panelWattage}
                  onChange={e => handleInputChange('panelWattage', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {PanelWattages.map(w => (
                    <option key={w} value={w}>{w} Wp</option>
                  ))}
                </select>
              </InputField>
              <InputField label="Inverter Type" icon={Zap} required>
                <select
                  value={inputs.inverterType}
                  onChange={e => handleInputChange('inverterType', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {InverterTypes.map(inv => (
                    <option key={inv.value} value={inv.value}>{inv.label}</option>
                  ))}
                </select>
              </InputField>
            </SectionCard>

            <SectionCard title="Battery Backup" icon={Battery}>
              <InputField label="Battery Required">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inputs.batteryRequired}
                    onChange={e => handleInputChange('batteryRequired', e.target.checked)}
                    className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium">Include Battery Backup</span>
                </label>
              </InputField>
              {inputs.batteryRequired && (
                <InputField label="Backup Hours" hint="Hours of backup needed">
                  <input
                    type="number"
                    value={inputs.backupHours}
                    onChange={e => handleInputChange('backupHours', e.target.value)}
                    min="1" max="24"
                    className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-amber-500 outline-none ${errors.backupHours ? 'border-red-300' : 'border-gray-200'}`}
                  />
                </InputField>
              )}
            </SectionCard>

            <SectionCard title="Subsidy & Financial" icon={DollarSign}>
              <InputField label="Subsidy Eligible">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inputs.subsidyEligible}
                    onChange={e => handleInputChange('subsidyEligible', e.target.checked)}
                    className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium">Eligible for Government Subsidy</span>
                </label>
              </InputField>
              <InputField label="Discount (%)" icon={Percent}>
                <input
                  type="number"
                  value={inputs.discountPercent}
                  onChange={e => handleInputChange('discountPercent', e.target.value)}
                  min="0" max="100"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </InputField>
              <InputField label="Profit Margin (%)" icon={Percent}>
                <input
                  type="number"
                  value={inputs.profitMarginPercent}
                  onChange={e => handleInputChange('profitMarginPercent', e.target.value)}
                  min="0" max="50"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </InputField>
            </SectionCard>

            <SectionCard title="Cost Inputs (Optional)" icon={Truck} defaultOpen={false}>
              <InputField label="Structure Cost (₹)" hint="Custom structure cost">
                <input
                  type="number"
                  value={inputs.structureCost}
                  onChange={e => handleInputChange('structureCost', e.target.value)}
                  placeholder="Auto-calculated"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </InputField>
              <InputField label="Wiring & Accessories (₹)">
                <input
                  type="number"
                  value={inputs.wiringCost}
                  onChange={e => handleInputChange('wiringCost', e.target.value)}
                  placeholder="Auto-calculated"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </InputField>
              <InputField label="Labor & Transport (₹)">
                <input
                  type="number"
                  value={inputs.laborCost}
                  onChange={e => handleInputChange('laborCost', e.target.value)}
                  placeholder="Auto-calculated"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </InputField>
              <InputField label="AMC Included">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inputs.amcIncluded}
                    onChange={e => handleInputChange('amcIncluded', e.target.checked)}
                    className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium">Include Annual Maintenance</span>
                </label>
              </InputField>
            </SectionCard>

            <button
              onClick={calculateSystem}
              disabled={calculating}
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-primary-900 font-bold text-lg rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {calculating ? <><Loader2 className="w-5 h-5 animate-spin" /> Calculating...</> : <><Calculator className="w-5 h-5" /> Calculate System</>}
            </button>
          </div>

          <div className="space-y-4">
            <div className="sticky top-6">
              {!results ? (
                <div className="bg-white rounded-2xl shadow-card p-8 text-center">
                  <Sun className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Enter details and calculate to see results</p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sun className="w-5 h-5" />
                        <span className="text-white/80 font-medium">Recommended System Size</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        results?.roofAreaStatus === 'Perfect Fit' ? 'bg-green-500' :
                        results?.roofAreaStatus === 'Roof Limited' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        {results?.roofAreaStatus || 'Calculated'}
                      </span>
                    </div>
                    <div className="text-4xl font-bold">{fmtKw(results?.recommendedSystemKw || results?.systemSizeKw)} kW</div>
                    <div className="text-white/70 text-sm mt-1">{results?.panelCount || 0} × {inputs.panelWattage}Wp Panels</div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-card p-4">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" /> 3 Suggestion Modes
                    </h3>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <div className="text-lg font-bold text-blue-700">{fmtKw(results?.idealSystemKw)} kW</div>
                        <div className="text-xs text-blue-600">Ideal</div>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-xl">
                        <div className="text-lg font-bold text-amber-700">{fmtKw(results?.roofFitSystemKw)} kW</div>
                        <div className="text-xs text-amber-600">Fits Roof</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-xl">
                        <div className="text-lg font-bold text-green-700">{fmtKw(results?.recommendedSystemKw)} kW</div>
                        <div className="text-xs text-green-600">Recommended</div>
                      </div>
                    </div>
                    {(results?.availableRoofAreaSqFt || 0) > 0 && (
                      <div className="mt-2 text-xs text-gray-500 text-center">
                        Roof: {results?.availableRoofAreaSqFt} sq.ft | Required: {results?.requiredRoofAreaSqFt} sq.ft
                      </div>
                    )}
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                    <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" /> Recommendation Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Ideal System Size</span>
                        <span className="font-bold text-green-800">{fmtKw(results?.idealSystemKw)} kW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Roof-Fit System Size</span>
                        <span className="font-bold text-green-800">{fmtKw(results?.roofFitSystemKw)} kW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Final Recommended Size</span>
                        <span className="font-bold text-green-800">{fmtKw(results?.recommendedSystemKw)} kW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Monthly Units (Roof Can Support)</span>
                        <span className="font-bold text-green-800">{results?.monthlyUnitsUsed || Math.round((results?.recommendedSystemKw || 0) * 120)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-card p-5">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" /> Generation & Savings
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Monthly Generation</span>
                        <span className="font-bold text-gray-900">{(results?.monthlyGenerationKwh || 0)} kWh</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Annual Generation</span>
                        <span className="font-bold text-gray-900">{(results?.annualGenerationKwh || 0)} kWh</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Monthly Savings</span>
                        <span className="font-bold text-green-600">₹{fmt(results?.monthlySavings)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Annual Savings</span>
                        <span className="font-bold text-green-600">₹{fmt(results?.annualSavings)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-card p-5">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-amber-500" /> Cost Breakdown
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-600">Panel Cost</span><span>₹{fmt(results?.equipmentCost)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Inverter</span><span>₹{fmt(results?.inverterCost)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Structure</span><span>₹{fmt(results?.structureCost)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Wiring</span><span>₹{fmt(results?.wiringCost)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600">Labor</span><span>₹{fmt(results?.laborCost)}</span></div>
                      {(results?.batteryCost || 0) > 0 && <div className="flex justify-between"><span className="text-gray-600">Battery</span><span>₹{fmt(results?.batteryCost)}</span></div>}
                      {(results?.amcCost || 0) > 0 && <div className="flex justify-between"><span className="text-gray-600">AMC</span><span>₹{fmt(results?.amcCost)}</span></div>}
                      <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                        <span>Total Cost</span><span>₹{fmt(results?.totalProjectCost || results?.subtotal)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                    <h3 className="font-bold text-green-800 mb-3">Financial Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-green-700">Discount ({inputs.discountPercent}%)</span><span className="text-red-600">-₹{fmt(results?.discountAmount)}</span></div>
                      <div className="flex justify-between"><span className="text-green-700">Profit Margin ({inputs.profitMarginPercent}%)</span><span>+₹{fmt(results?.profitMargin || results?.profitAmount)}</span></div>
                      {(results?.subsidyAmount || 0) > 0 && <div className="flex justify-between"><span className="text-green-700">Govt Subsidy</span><span className="text-green-600">-₹{fmt(results?.subsidyAmount)}</span></div>}
                      <div className="flex justify-between pt-2 border-t border-green-200 font-bold text-lg">
                        <span>Final Price</span><span>₹{fmt(results?.finalSellingPrice || results?.finalPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>After Subsidy</span>
                        <span className="font-bold text-green-700">₹{fmt(results?.costAfterSubsidy || results?.finalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-card p-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-amber-50 rounded-xl">
                        <Clock className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-amber-700">{results?.paybackYears || results?.estimatedPaybackYears || '-'}</div>
                        <div className="text-xs text-amber-600">Years Payback</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-700">₹{fmt(results?.costPerWatt)}</div>
                        <div className="text-xs text-blue-600">Cost/Watt</div>
                      </div>
                    </div>
                  </div>

                  {(results?.batteryCapacityKwh || results?.batteryCost || 0) > 0 && (
                    <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Battery className="w-5 h-5 text-purple-600" />
                        <span className="font-bold text-purple-800">Battery Specification</span>
                      </div>
                      <p className="text-purple-700">{(results?.batteryCapacityKwh || 0)} kWh Lithium Battery Backup</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button onClick={saveCalculation} className="flex-1 py-3 bg-white border-2 border-amber-400 text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-all flex items-center justify-center gap-2">
                      <Save className="w-5 h-5" /> Save
                    </button>
                    <button onClick={exportProposal} className="flex-1 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" /> Export
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}