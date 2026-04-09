import { query } from '../config/database.js';

export const getBookings = async (req, res, next) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await query(`
        SELECT b.*, u.name as customer_name, u.email, p.name as plan_name 
        FROM bookings b 
        LEFT JOIN users u ON b.user_id = u.id 
        LEFT JOIN plans p ON b.plan_id = p.id 
        ORDER BY b.created_at DESC
      `);
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
    const { inspection_status, installation_status } = req.body;
    const result = await query(
      'UPDATE bookings SET inspection_status = COALESCE($1, inspection_status), installation_status = COALESCE($2, installation_status) WHERE id = $3 RETURNING *',
      [inspection_status, installation_status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
