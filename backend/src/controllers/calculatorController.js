import { query } from '../config/database.js';

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const toNum = (v, d = 0) => v === '' || v === null || v === undefined || Number.isNaN(Number(v)) ? d : Number(v);
const getBaseRate = (connectionType, installationType, inverterType) => {
  let rate = connectionType === 'commercial' ? 62000 : 54000;
  if (installationType === 'ground') rate += 6000;
  if (inverterType === 'hybrid') rate += 9000;
  if (inverterType === 'offgrid') rate += 14000;
  return rate;
};

export const getCalculations = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT * FROM calculator_saves ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      message: 'Calculations retrieved successfully',
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const calculateSystem = async (req, res, next) => {
  try {
    console.log('[calculator] Received payload:', JSON.stringify(req.body));

    const {
      monthlyUnits,
      monthlyBill,
      roofArea,
      panelWattage,
      inverterType,
      batteryRequired,
      backupHours,
      shadowLossPercent,
      subsidyEligible,
      structureCost,
      wiringCost,
      laborCost,
      amcIncluded,
      discountPercent,
      profitMarginPercent,
      city,
      connectionType,
      installationType,
    } = req.body;

    const monthlyUnitsVal = toNum(monthlyUnits);
    const monthlyBillVal = toNum(monthlyBill);
    const roofAreaVal = toNum(roofArea);
    const panelWattageVal = toNum(panelWattage, 550);
    const backupHoursVal = toNum(backupHours, 0);
    const shadowLossPercentVal = toNum(shadowLossPercent, 5);
    const structureCostVal = toNum(structureCost, 0);
    const wiringCostVal = toNum(wiringCost, 0);
    const laborCostVal = toNum(laborCost, 0);
    const discountPercentVal = toNum(discountPercent, 0);
    const profitMarginPercentVal = toNum(profitMarginPercent, 10);
    const amcIncludedVal = !!amcIncluded;
    const subsidyEligibleVal = !!subsidyEligible;
    const inverterTypeVal = inverterType || 'ongrid';
    const cityVal = city || 'Mumbai';
    const connectionTypeVal = connectionType || 'residential';
    const installationTypeVal = installationType || 'rooftop';

    const units = monthlyUnitsVal;
    const bill = monthlyBillVal;
    const roof = roofAreaVal;

    let derivedUnits = units;
    let monthlyUnitsUsed = units;
    let unitsSource = 'monthlyUnits';

    if (units > 0) {
      if (bill > 0) {
        const impliedUnitsFromBill = bill / 8;
        const ratio = units > 0 ? impliedUnitsFromBill / units : 0;
        if (ratio > 2 || ratio < 0.5) {
          return res.status(400).json({
            success: false,
            message: `Monthly units seem too low compared to bill (${impliedUnitsFromBill.toFixed(0)} units expected). Please verify.`,
          });
        }
      }
      derivedUnits = units;
      unitsSource = 'monthlyUnits';
      monthlyUnitsUsed = units;
    } else if (bill > 0) {
      derivedUnits = bill / 8;
      unitsSource = 'derived';
      monthlyUnitsUsed = Math.round(derivedUnits);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Monthly Units or Monthly Bill is required',
      });
    }

    const idealSystemKwRaw = derivedUnits / 120;
    const idealSystemKw = idealSystemKwRaw < 0.5 ? 0.5 : round2(idealSystemKwRaw);
    const idealRequiredRoofArea = round2(idealSystemKw * 100);

    let roofFitSystemKw = idealSystemKw;
    let roofAreaStatus = 'Perfect Fit';
    if (roof > 0 && idealRequiredRoofArea > roof) {
      roofFitSystemKw = roof / 100;
      if (roofFitSystemKw < 0.5) roofFitSystemKw = 0.5;
      roofFitSystemKw = round2(roofFitSystemKw);
      roofAreaStatus = 'Roof Limited';
    }
    if (roof === 0) {
      roofAreaStatus = 'No Roof Data';
    }

    const recommendedSystemKw = roofAreaStatus === 'Roof Limited' ? roofFitSystemKw : idealSystemKw;
    const recommendedRequiredRoofArea = round2(recommendedSystemKw * 100);
    const monthlyUnitsSupportedByRoof = Math.round(recommendedSystemKw * 120);

    if (roof > 0 && recommendedRequiredRoofArea > roof) {
      roofAreaStatus = 'Insufficient Roof';
    }

    const shadowFactor = 1 - (shadowLossPercentVal || 0) / 100;
    const adjustedSystemKw = round2(recommendedSystemKw / Math.max(shadowFactor, 0.5));
    const systemSizeKw = adjustedSystemKw < 0.5 ? 0.5 : adjustedSystemKw;

    const panelCount = Math.ceil((systemSizeKw * 1000) / panelWattageVal);
    const requiredRoofAreaSqFt = round2(systemSizeKw * 100);
    const availableRoofAreaSqFt = roof;

    const baseRate = getBaseRate(connectionTypeVal, installationTypeVal, inverterTypeVal);
    const baseSystemCost = round2(systemSizeKw * baseRate);

    const batteryCost = batteryRequired
      ? round2(systemSizeKw * Math.max(backupHoursVal || 1, 1) * 8000)
      : 0;

    const extraCosts = structureCostVal + wiringCostVal + laborCostVal;

    const subtotal = round2(baseSystemCost + batteryCost + extraCosts);

    const subsidyAmount = subsidyEligibleVal && connectionTypeVal === 'residential'
      ? round2(Math.min(systemSizeKw, 3) * 18000)
      : 0;

    const discountAmount = round2(subtotal * (discountPercentVal / 100));
    const profitAmount = round2((subtotal - subsidyAmount - discountAmount) * (profitMarginPercentVal / 100));
    const finalPrice = round2(subtotal - subsidyAmount - discountAmount + profitAmount);

    const monthlySavings = derivedUnits > 0 ? round2(derivedUnits * 8) : round2(bill * 0.9);
    const annualSavings = round2(monthlySavings * 12);
    const paybackYears = annualSavings > 0 ? round2(finalPrice / annualSavings) : null;
    const annualGenerationKwh = round2(systemSizeKw * 4.5 * 365);
    const monthlyGenerationKwh = round2(annualGenerationKwh / 12);

    const amcCost = amcIncludedVal ? round2(systemSizeKw * 2000) : 0;

    const equipmentCost = round2(baseSystemCost * 0.65);
    const inverterCost = round2(baseSystemCost * 0.15);
    const calcStructureCost = round2(extraCosts > 0 ? extraCosts * 0.4 : baseSystemCost * 0.08);
    const calcWiringCost = round2(extraCosts > 0 ? extraCosts * 0.3 : baseSystemCost * 0.06);
    const calcLaborCost = round2(extraCosts > 0 ? extraCosts * 0.3 : baseSystemCost * 0.06);

    const totalProjectCost = round2(subtotal + profitAmount + amcCost);
    const costAfterSubsidy = round2(totalProjectCost - subsidyAmount);
    const costPerWatt = systemSizeKw > 0 ? round2(totalProjectCost / (systemSizeKw * 1000)) : 0;
    const batteryCapacityKwh = batteryRequired ? round2(systemSizeKw * Math.max(backupHoursVal || 1, 1)) : 0;

    res.json({
      success: true,
      message: 'Calculation complete',
      data: {
        results: {
          idealSystemKw,
          roofFitSystemKw,
          recommendedSystemKw,
          idealRequiredRoofArea,
          requiredRoofAreaSqFt,
          availableRoofAreaSqFt,
          monthlyUnitsUsed,
          monthlyUnitsDerived: unitsSource === 'derived' ? monthlyUnitsUsed : null,
          roofAreaStatus,
          monthlyGenerationKwh,
          annualGenerationKwh,
          monthlySavings,
          annualSavings,
          equipmentCost,
          inverterCost,
          structureCost: calcStructureCost,
          wiringCost: calcWiringCost,
          laborCost: calcLaborCost,
          batteryCost,
          amcCost,
          totalProjectCost,
          discountAmount,
          profitMargin: profitAmount,
          subsidyAmount,
          finalPrice,
          finalSellingPrice: finalPrice,
          costAfterSubsidy,
          costPerWatt,
          paybackYears,
          batteryCapacityKwh,
          panelCount,
          panelWattage: Number(panelWattage),
          inverterType: inverterTypeVal,
          batteryRequired,
          backupHours: backupHoursVal,
          subtotal,
          city: cityVal,
          connectionType: connectionTypeVal,
          installationType: installationTypeVal,
        },
      },
    });
  } catch (error) {
    console.error('[calculator] Error:', error.message, 'Field:', error.stack);
    next(error);
  }
};

export const saveCalculation = async (req, res, next) => {
  try {
    const { leadId, inputs, results, notes = '' } = req.body;

    const result = await query(
      `
      INSERT INTO calculator_saves (lead_id, inputs, results, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [leadId || null, JSON.stringify(inputs || {}), JSON.stringify(results || {}), notes]
    );

    res.status(201).json({
      success: true,
      message: 'Calculation saved successfully',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCalculation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `DELETE FROM calculator_saves WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Calculation not found',
      });
    }

    res.json({
      success: true,
      message: 'Calculation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const convertToQuote = async (req, res, next) => {
  try {
    const { calcId } = req.body;

    const calcRes = await query(
      `SELECT * FROM calculator_saves WHERE id = $1`,
      [calcId]
    );

    if (calcRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Calculation not found',
      });
    }

    const calc = calcRes.rows[0];
    let results = calc.results;
    if (typeof results === 'string') {
      results = JSON.parse(results);
    }
    results = results || {};
    const totalAmount = Number(results.finalPrice || results.finalSellingPrice || 0);

    const quoteRes = await query(
      `
      INSERT INTO quotations (booking_id, total_amount, validity_date, status)
      VALUES ($1, $2, CURRENT_DATE + INTERVAL '30 days', 'pending')
      RETURNING *
      `,
      [null, totalAmount]
    );

    res.json({
      success: true,
      message: 'Converted to quote successfully',
      data: quoteRes.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
