const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

exports.createLead = async (req, res, next) => {
  try {
    const {
      name, email, phone, address, city, state, pincode,
      serviceType, capacity, roofType, monthlyBill, message, source
    } = req.body;

    const leadId = uuidv4();
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        id: leadId,
        name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        service_type: serviceType,
        capacity,
        roof_type: roofType,
        monthly_bill: monthlyBill,
        message,
        source: source || 'website',
        status: 'new',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Lead created successfully',
      lead
    });
  } catch (error) {
    next(error);
  }
};

exports.getLeads = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: leads, error, count } = await query;

    if (error) throw error;

    res.json({
      leads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getLeadById = async (req, res, next) => {
  try {
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    next(error);
  }
};

exports.updateLead = async (req, res, next) => {
  try {
    const { status, assignedTo, notes } = req.body;

    const { data: lead, error } = await supabase
      .from('leads')
      .update({ status, assigned_to: assignedTo, notes })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getMyLeads = async (req, res, next) => {
  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .eq('assigned_to', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(leads);
  } catch (error) {
    next(error);
  }
};
