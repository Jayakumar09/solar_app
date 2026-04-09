const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

exports.createBooking = async (req, res, next) => {
  try {
    const {
      leadId, customerId, serviceType, scheduledDate,
      preferredTime, notes
    } = req.body;

    const bookingId = uuidv4();
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        id: bookingId,
        lead_id: leadId,
        customer_id: customerId,
        service_type: serviceType,
        scheduled_date: scheduledDate,
        preferred_time: preferredTime,
        notes,
        status: 'scheduled',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    if (leadId) {
      await supabase
        .from('leads')
        .update({ status: 'booked' })
        .eq('id', leadId);
    }

    res.status(201).json({
      message: 'Booking scheduled successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookings = async (req, res, next) => {
  try {
    const { status, date } = req.query;

    let query = supabase
      .from('bookings')
      .select('*, leads(*), users!customer_id(*)', { count: 'exact' })
      .order('scheduled_date', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }
    if (date) {
      query = query.eq('scheduled_date', date);
    }

    const { data: bookings, error, count } = await query;

    if (error) throw error;

    res.json({ bookings, total: count });
  } catch (error) {
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*, leads(*), users!customer_id(name, email, phone)')
      .eq('id', req.params.id)
      .single();

    if (error || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const { status, scheduledDate, notes } = req.body;

    const { data: booking, error } = await supabase
      .from('bookings')
      .update({ status, scheduled_date: scheduledDate, notes })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

exports.getCustomerBookings = async (req, res, next) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_id', req.user.id)
      .order('scheduled_date', { ascending: false });

    if (error) throw error;
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};
