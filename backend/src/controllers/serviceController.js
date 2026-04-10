import { query } from '../config/database.js';

export const getServiceRequests = async (req, res, next) => {
  try {
    const normalizedRole = req.user.role === 'customer' ? 'client' : req.user.role;
    let result;
    if (normalizedRole === 'admin') {
      result = await query(`
        SELECT sr.*, u.name as customer_name, b.id as booking_id 
        FROM service_requests sr 
        LEFT JOIN users u ON sr.user_id = u.id 
        LEFT JOIN bookings b ON sr.booking_id = b.id 
        ORDER BY sr.created_at DESC
      `);
    } else if (normalizedRole === 'vendor') {
      result = await query(`
        SELECT sr.*, u.name as customer_name, b.id as booking_id
        FROM service_requests sr
        LEFT JOIN users u ON sr.user_id = u.id
        LEFT JOIN bookings b ON sr.booking_id = b.id
        WHERE b.vendor_id = $1
        ORDER BY sr.created_at DESC
      `, [req.user.id]);
    } else {
      result = await query(`
        SELECT sr.*, b.id as booking_id 
        FROM service_requests sr 
        LEFT JOIN bookings b ON sr.booking_id = b.id 
        WHERE sr.user_id = $1 
        ORDER BY sr.created_at DESC
      `, [req.user.id]);
    }
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createServiceRequest = async (req, res, next) => {
  try {
    const normalizedRole = req.user.role === 'customer' ? 'client' : req.user.role;
    const { booking_id, service_type, description, scheduled_date } = req.body;
    if (booking_id) {
      const checkBooking = await query('SELECT id, user_id FROM bookings WHERE id = $1', [booking_id]);
      if (checkBooking.rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      if (normalizedRole !== 'admin' && checkBooking.rows[0].user_id !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to create service for this booking' });
      }
    }
    const result = await query(
      'INSERT INTO service_requests (user_id, booking_id, service_type, description, scheduled_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, booking_id, service_type, description, scheduled_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateServiceStatus = async (req, res, next) => {
  try {
    const normalizedRole = req.user.role === 'customer' ? 'client' : req.user.role;
    const { id } = req.params;
    const checkResult = await query('SELECT id, user_id FROM service_requests WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Service request not found' });
    }
    if (normalizedRole !== 'admin' && checkResult.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this service request' });
    }
    const { status, scheduled_date } = req.body;
    const result = await query(
      'UPDATE service_requests SET status = COALESCE($1, status), scheduled_date = COALESCE($2, scheduled_date) WHERE id = $3 RETURNING *',
      [status, scheduled_date, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
