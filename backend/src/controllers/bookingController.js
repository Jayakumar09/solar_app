import { query } from '../config/database.js';

export const getBookings = async (req, res, next) => {
  try {
    const normalizedRole = req.user.role === 'customer' ? 'client' : req.user.role;
    let result;
    if (normalizedRole === 'admin') {
      result = await query(`
        SELECT b.*, u.name as customer_name, u.email, u.phone, u.city, p.name as plan_name 
        FROM bookings b 
        LEFT JOIN users u ON b.user_id = u.id 
        LEFT JOIN plans p ON b.plan_id = p.id 
        ORDER BY b.created_at DESC
      `);
    } else if (normalizedRole === 'vendor') {
      result = await query(`
        SELECT b.*, u.name as customer_name, u.email, u.phone, u.city, p.name as plan_name
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.id
        LEFT JOIN plans p ON b.plan_id = p.id
        WHERE b.vendor_id = $1
        ORDER BY b.created_at DESC
      `, [req.user.id]);
    } else {
      result = await query(`
        SELECT b.*, p.name as plan_name 
        FROM bookings b 
        LEFT JOIN plans p ON b.plan_id = p.id 
        WHERE b.user_id = $1 
        ORDER BY b.created_at DESC
      `, [req.user.id]);
    }
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { plan_id, booking_date, lead_id } = req.body;
    const result = await query(
      'INSERT INTO bookings (user_id, plan_id, booking_date, lead_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, plan_id, booking_date, lead_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const checkResult = await query('SELECT id FROM bookings WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    const { inspection_status, installation_status, status } = req.body;
    const result = await query(
      `UPDATE bookings SET 
        inspection_status = COALESCE($1, inspection_status), 
        installation_status = COALESCE($2, installation_status),
        status = COALESCE($3, status)
       WHERE id = $4 RETURNING *`,
      [inspection_status, installation_status, status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
