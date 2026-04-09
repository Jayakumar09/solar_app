import { query } from '../config/database.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [leads, bookings, enquiries, users, plans] = await Promise.all([
      query('SELECT COUNT(*) as count, status FROM leads GROUP BY status'),
      query('SELECT COUNT(*) as count FROM bookings'),
      query('SELECT COUNT(*) as count FROM contact_enquiries'),
      query('SELECT COUNT(*) as count FROM users WHERE role = $1', ['customer']),
      query('SELECT * FROM plans')
    ]);

    const metricsResult = await query('SELECT * FROM impact_metrics');
    const recentBookings = await query(`
      SELECT b.*, u.name as customer_name, p.name as plan_name 
      FROM bookings b 
      LEFT JOIN users u ON b.user_id = u.id 
      LEFT JOIN plans p ON b.plan_id = p.id 
      ORDER BY b.created_at DESC LIMIT 5
    `);

    res.json({
      leads: leads.rows,
      totalBookings: bookings.rows[0]?.count || 0,
      totalEnquiries: enquiries.rows[0]?.count || 0,
      totalCustomers: users.rows[0]?.count || 0,
      plans: plans.rows,
      metrics: metricsResult.rows,
      recentBookings: recentBookings.rows
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const result = await query('SELECT id, email, name, phone, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};
