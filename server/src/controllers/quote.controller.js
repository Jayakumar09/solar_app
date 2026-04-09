const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

exports.createQuote = async (req, res, next) => {
  try {
    const {
      leadId, customerId, planId, systemCapacity,
      equipmentCost, installationCost, totalAmount,
      paymentTerms, validUntil, notes
    } = req.body;

    const quoteId = uuidv4();
    const { data: quote, error } = await supabase
      .from('quotes')
      .insert({
        id: quoteId,
        lead_id: leadId,
        customer_id: customerId,
        plan_id: planId,
        system_capacity: systemCapacity,
        equipment_cost: equipmentCost,
        installation_cost: installationCost,
        estimated_amount: totalAmount,
        payment_terms: paymentTerms,
        valid_until: validUntil,
        notes,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Quote created successfully',
      quote
    });
  } catch (error) {
    next(error);
  }
};

exports.getQuotes = async (req, res, next) => {
  try {
    const { status } = req.query;

    let query = supabase
      .from('quotes')
      .select('*, leads(*), plans(*)', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: quotes, error, count } = await query;

    if (error) throw error;

    res.json({ quotes, total: count });
  } catch (error) {
    next(error);
  }
};

exports.getQuoteById = async (req, res, next) => {
  try {
    const { data: quote, error } = await supabase
      .from('quotes')
      .select('*, leads(*), plans(*), users!customer_id(*)')
      .eq('id', req.params.id)
      .single();

    if (error || !quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.json(quote);
  } catch (error) {
    next(error);
  }
};

exports.updateQuote = async (req, res, next) => {
  try {
    const { status, notes, estimatedAmount } = req.body;

    const { data: quote, error } = await supabase
      .from('quotes')
      .update({
        status,
        notes,
        estimated_amount: estimatedAmount
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(quote);
  } catch (error) {
    next(error);
  }
};

exports.getCustomerQuotes = async (req, res, next) => {
  try {
    const { data: quotes, error } = await supabase
      .from('quotes')
      .select('*, plans(*)')
      .eq('customer_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(quotes);
  } catch (error) {
    next(error);
  }
};

exports.acceptQuote = async (req, res, next) => {
  try {
    const { data: quote, error } = await supabase
      .from('quotes')
      .update({ status: 'accepted' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(quote);
  } catch (error) {
    next(error);
  }
};
