const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

exports.getAllCalculations = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('calculator_calcs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'Calculations retrieved successfully',
      data: data || []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve calculations',
      data: null
    });
  }
};

exports.createCalculation = async (req, res) => {
  try {
    const {
      lead_id,
      customer_id,
      monthly_units,
      monthly_bill,
      roof_type,
      roof_area,
      city,
      connection_type,
      phase_type,
      panel_wattage,
      inverter_type,
      battery_required,
      backup_hours,
      subsidy_eligible,
      shadow_loss_percent,
      installation_type,
      system_size_kw,
      panel_count,
      inverter_capacity_kw,
      battery_capacity_kwh,
      monthly_generation_kwh,
      annual_generation_kwh,
      monthly_savings,
      annual_savings,
      payback_years,
      cost_per_watt,
      equipment_cost,
      installation_cost,
      structure_cost,
      wiring_cost,
      labor_cost,
      inverter_cost,
      battery_cost,
      amc_cost,
      total_project_cost,
      final_selling_price,
      subsidy_amount,
      cost_after_subsidy,
      discount_amount,
      profit_margin,
      notes,
      status
    } = req.body;

    const id = uuidv4();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('calculator_calcs')
      .insert({
        id,
        lead_id,
        customer_id,
        monthly_units,
        monthly_bill,
        roof_type,
        roof_area,
        city,
        connection_type,
        phase_type,
        panel_wattage,
        inverter_type,
        battery_required,
        backup_hours,
        subsidy_eligible,
        shadow_loss_percent,
        installation_type,
        system_size_kw,
        panel_count,
        inverter_capacity_kw,
        battery_capacity_kwh,
        monthly_generation_kwh,
        annual_generation_kwh,
        monthly_savings,
        annual_savings,
        payback_years,
        cost_per_watt,
        equipment_cost,
        installation_cost,
        structure_cost,
        wiring_cost,
        labor_cost,
        inverter_cost,
        battery_cost,
        amc_cost,
        total_project_cost,
        final_selling_price,
        subsidy_amount,
        cost_after_subsidy,
        discount_amount,
        profit_margin,
        notes,
        status: status || 'draft',
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: 'Calculation saved successfully',
      data: data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to save calculation',
      data: null
    });
  }
};

exports.getCalculationById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('calculator_calcs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Calculation not found',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Calculation retrieved successfully',
      data: data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve calculation',
      data: null
    });
  }
};

exports.deleteCalculation = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('calculator_calcs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'Calculation deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete calculation',
      data: null
    });
  }
};

exports.calculateSystem = async (req, res) => {
  try {
    const inputs = req.body;
    
    const validation = validateInputs(inputs);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        data: null,
        errors: validation.errors
      });
    }

    const results = performSolarCalculation(inputs);
    
    return res.status(200).json({
      success: true,
      message: 'Calculation completed successfully',
      data: { inputs, results }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Calculation failed',
      data: null
    });
  }
};

function validateInputs(inputs) {
  const errors = [];
  const { monthly_units, monthly_bill, roof_area } = inputs;

  if (!monthly_units && !inputs.system_size_kw) {
    errors.push('Monthly units is required');
  }
  if (monthly_units && monthly_units < 0) {
    errors.push('Monthly units cannot be negative');
  }
  if (monthly_bill && monthly_bill < 0) {
    errors.push('Monthly bill cannot be negative');
  }
  if (roof_area && roof_area < 10) {
    errors.push('Roof area seems too small (minimum 10 sq ft)');
  }
  if (roof_area && roof_area > 10000) {
    errors.push('Roof area seems too large');
  }

  return { valid: errors.length === 0, errors };
}

const PRICING_CONFIG = {
  panelCosts: { 330: 4500, 400: 5500, 450: 6200, 500: 7000, 550: 7800, 600: 9000 },
  inverterCosts: { ongrid: 25000, hybrid: 45000, offgrid: 35000 },
  batteryCosts: { lithium: 40000, lithium_10: 120000 },
  structureCost: { concrete: 12000, tin: 8000, tiled: 10000, flat: 15000 },
  laborCost: { rooftop: 15000, ground: 20000 },
  wiringCost: 8000,
  amcCost: 5000,
  SubsidyRates: {
    residential: { upto3kW: 30, upto10kW: 20, above10kW: 0 },
    commercial: { upto10kW: 20, above10kW: 0 }
  },
  generationPerkW: 4.5,
  degradationRate: 0.005,
  unitRate: 8
};

const CITY_SOLAR_DATA = {
  mumbai: { peakSunHours: 5.2, efficiency: 0.95 },
  pune: { peakSunHours: 5.5, efficiency: 0.96 },
  delhi: { peakSunHours: 5.8, efficiency: 0.97 },
  bangalore: { peakSunHours: 5.4, efficiency: 0.95 },
  hyderabad: { peakSunHours: 5.6, efficiency: 0.96 },
  chennai: { peakSunHours: 5.3, efficiency: 0.94 },
  kolkata: { peakSunHours: 5.0, efficiency: 0.93 },
  ahmedabad: { peakSunHours: 5.9, efficiency: 0.97 },
  nagpur: { peakSunHours: 5.7, efficiency: 0.96 },
  surat: { peakSunHours: 5.6, efficiency: 0.96 }
};

function getCityData(city) {
  const normalized = city?.toLowerCase() || 'mumbai';
  return CITY_SOLAR_DATA[normalized] || { peakSunHours: 5.2, efficiency: 0.95 };
}

function performSolarCalculation(inputs) {
  const {
    monthly_units, monthly_bill, roof_type = 'concrete', roof_area, city,
    connection_type = 'residential', phase_type = 'single', panel_wattage = 550,
    inverter_type = 'ongrid', battery_required = false, backup_hours = 0,
    subsidy_eligible = true, shadow_loss_percent = 5, installation_type = 'rooftop',
    discount_percent = 0, profit_margin_percent = 10
  } = inputs;

  const cityData = getCityData(city);
  const peakSunHours = cityData.peakSunHours;
  const efficiencyFactor = cityData.efficiency * (1 - shadow_loss_percent / 100);

  let system_size_kw;
  if (inputs.system_size_kw) {
    system_size_kw = parseFloat(inputs.system_size_kw);
  } else {
    const monthlyUnitsVal = parseFloat(monthly_units) || (parseFloat(monthly_bill) / PRICING_CONFIG.unitRate);
    const dailyUnits = monthlyUnitsVal / 30;
    system_size_kw = Math.round((dailyUnits / (peakSunHours * efficiencyFactor)) * 1.2 * 100) / 100;
  }

  const panelPower = parseInt(panel_wattage);
  const requiredPanels = Math.ceil((system_size_kw * 1000) / panelPower);

  const panelCost = (PRICING_CONFIG.panelCosts[panelPower] || 7000) * requiredPanels;
  const inverterCost = PRICING_CONFIG.inverterCosts[inverter_type] || 30000;
  const strCost = PRICING_CONFIG.structureCost[roof_type] || 12000;
  const wrCost = PRICING_CONFIG.wiringCost;
  const labCost = PRICING_CONFIG.laborCost[installation_type] || 15000;

  const equipmentCost = panelCost + inverterCost;
  const installationCost = strCost + wrCost + labCost;
  const totalProjectCost = equipmentCost + installationCost;

  const amcCost = inputs.amc_included ? PRICING_CONFIG.amcCost : 0;
  const totalWithAmc = totalProjectCost + amcCost;

  const inverterCapacity = Math.ceil(system_size_kw * (phase_type === 'three' ? 1.1 : 1.2) * 10) / 10;

  let batteryCapacityKwh = 0;
  let batteryCost = 0;
  if (battery_required) {
    const monthlyUnitsVal = parseFloat(monthly_units) || 300;
    const dailyUnits = monthlyUnitsVal / 30;
    batteryCapacityKwh = Math.ceil((dailyUnits * backup_hours / 0.8) * 1.2);
    batteryCost = batteryCapacityKwh <= 5 ? batteryCapacityKwh * 40000 : 120000;
  }

  const finalCost = totalWithAmc + batteryCost;
  const discountedCost = finalCost * (1 - discount_percent / 100);
  const marginAmount = discountedCost * (profit_margin_percent / 100);
  const finalSellingPrice = Math.round(discountedCost + marginAmount);

  const subsidyAmount = subsidy_eligible ? calculateSubsidy(system_size_kw, connection_type, finalSellingPrice) : 0;
  const costAfterSubsidy = finalSellingPrice - subsidyAmount;

  const monthlyGeneration = Math.round(system_size_kw * peakSunHours * 30 * efficiencyFactor);
  const annualGeneration = monthlyGeneration * 12;
  const annualSavings = Math.round(annualGeneration * PRICING_CONFIG.unitRate);
  const monthlySavings = Math.round(annualSavings / 12);
  const paybackYears = monthlySavings > 0 ? Math.round((costAfterSubsidy / annualSavings) * 10) / 10 : 999;
  const costPerWatt = Math.round(finalSellingPrice / (system_size_kw * 1000));

  return {
    system_size_kw,
    panel_count: requiredPanels,
    inverter_capacity_kw: inverterCapacity,
    battery_capacity_kwh: batteryCapacityKwh,
    monthly_generation_kwh: monthlyGeneration,
    annual_generation_kwh: annualGeneration,
    monthly_savings: monthlySavings,
    annual_savings: annualSavings,
    payback_years: paybackYears,
    cost_per_watt: costPerWatt,
    equipment_cost: Math.round(equipmentCost),
    installation_cost: Math.round(installationCost),
    structure_cost: Math.round(strCost),
    wiring_cost: Math.round(wrCost),
    labor_cost: Math.round(labCost),
    inverter_cost: Math.round(inverterCost),
    battery_cost: Math.round(batteryCost),
    amc_cost: Math.round(amcCost),
    total_project_cost: Math.round(totalProjectCost),
    final_cost_before_discount: Math.round(finalCost),
    discount_amount: Math.round(finalCost - discountedCost),
    profit_margin: Math.round(marginAmount),
    subsidy_amount: Math.round(subsidyAmount),
    final_selling_price: finalSellingPrice,
    cost_after_subsidy: Math.round(costAfterSubsidy),
    peak_sun_hours: peakSunHours,
    efficiency_factor: Math.round(efficiencyFactor * 100),
    degradation_rate: PRICING_CONFIG.degradationRate * 100
  };
}

function calculateSubsidy(systemSizeKw, connectionType, projectCost) {
  const category = connection_type === 'residential' ? 'residential' : 'commercial';
  const rates = PRICING_CONFIG.SubsidyRates[category];
  let rate = 0;
  if (systemSizeKw <= 3) rate = rates.upto3kW;
  else if (systemSizeKw <= 10) rate = rates.upto10kW;
  else rate = rates.above10kW || 0;

  const maxSubsidy = 48000;
  const subsidy = projectCost * (rate / 100);
  return Math.min(Math.round(subsidy), maxSubsidy);
}

exports.saveCalculation = async (req, res) => {
  try {
    const { leadId, customerId, inputs, results, notes } = req.body;

    if (!results) {
      return res.status(400).json({
        success: false,
        message: 'Calculation results required',
        data: null
      });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('calculator_calcs')
      .insert({
        id,
        lead_id: leadId,
        customer_id: customerId,
        monthly_units: inputs.monthlyUnits,
        monthly_bill: inputs.monthlyBill,
        roof_type: inputs.roofType,
        roof_area: inputs.roofArea,
        city: inputs.city,
        connection_type: inputs.connectionType,
        phase_type: inputs.phaseType,
        panel_wattage: inputs.panelWattage,
        inverter_type: inputs.inverterType,
        battery_required: inputs.batteryRequired,
        backup_hours: inputs.backupHours,
        subsidy_eligible: inputs.subsidyEligible,
        shadow_loss_percent: inputs.shadowLossPercent,
        installation_type: inputs.installationType,
        system_size_kw: results.systemSizeKw,
        panel_count: results.panelCount,
        inverter_capacity_kw: results.inverterCapacityKw,
        battery_capacity_kwh: results.batteryCapacityKwh,
        monthly_generation_kwh: results.monthlyGenerationKwh,
        subsidy_amount: results.subsidyAmount,
        total_project_cost: results.totalProjectCost,
        final_selling_price: results.finalSellingPrice,
        monthly_savings: results.monthlySavings,
        annual_savings: results.annualSavings,
        payback_years: results.paybackYears,
        cost_per_watt: results.costPerWatt,
        notes,
        status: 'saved',
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: 'Calculation saved successfully',
      data: data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to save calculation',
      data: null
    });
  }
};

exports.updateCalculationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('calculator_calcs')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'Calculation status updated',
      data: data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update status',
      data: null
    });
  }
};

exports.convertToQuote = async (req, res) => {
  try {
    const { calcId } = req.body;

    const { data: calc, error: calcError } = await supabase
      .from('calculator_calcs')
      .select('*')
      .eq('id', calcId)
      .single();

    if (calcError || !calc) {
      return res.status(404).json({
        success: false,
        message: 'Calculation not found',
        data: null
      });
    }

    const quoteId = uuidv4();
    const { data: quote, error } = await supabase
      .from('quotes')
      .insert({
        id: quoteId,
        lead_id: calc.lead_id,
        customer_id: calc.customer_id,
        system_capacity: `${calc.system_size_kw} kW`,
        equipment_cost: calc.equipment_cost,
        installation_cost: calc.installation_cost,
        estimated_amount: calc.final_selling_price,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('calculator_calcs')
      .update({ status: 'quoted', updated_at: new Date().toISOString() })
      .eq('id', calcId);

    return res.status(201).json({
      success: true,
      message: 'Converted to quote successfully',
      data: quote
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to convert to quote',
      data: null
    });
  }
};