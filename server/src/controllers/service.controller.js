const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

exports.createServiceRequest = async (req, res, next) => {
  try {
    const { customerId, bookingId, serviceType, description, priority } = req.body;

    const requestId = uuidv4();
    const { data: request, error } = await supabase
      .from('service_requests')
      .insert({
        id: requestId,
        customer_id: customerId,
        booking_id: bookingId,
        service_type: serviceType,
        description,
        priority: priority || 'medium',
        status: 'requested',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Service request created successfully',
      request
    });
  } catch (error) {
    next(error);
  }
};

exports.getServiceRequests = async (req, res, next) => {
  try {
    const { status } = req.query;

    let query = supabase
      .from('service_requests')
      .select('*, users!customer_id(*)', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: requests, error, count } = await query;

    if (error) throw error;

    res.json({ requests, total: count });
  } catch (error) {
    next(error);
  }
};

exports.getServiceRequestById = async (req, res, next) => {
  try {
    const { data: request, error } = await supabase
      .from('service_requests')
      .select('*, users!customer_id(*)')
      .eq('id', req.params.id)
      .single();

    if (error || !request) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    res.json(request);
  } catch (error) {
    next(error);
  }
};

exports.updateServiceRequest = async (req, res, next) => {
  try {
    const { status, technicianNotes, scheduledDate } = req.body;

    const { data: request, error } = await supabase
      .from('service_requests')
      .update({
        status,
        technician_notes: technicianNotes,
        scheduled_date: scheduledDate,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(request);
  } catch (error) {
    next(error);
  }
};

exports.getCustomerServiceRequests = async (req, res, next) => {
  try {
    const { data: requests, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('customer_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(requests);
  } catch (error) {
    next(error);
  }
};
