import { query, pool } from '../config/database.js';
import bcrypt from 'bcryptjs';

export const getDashboardStats = async (req, res, next) => {
  try {
    await pool.query('ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS city VARCHAR(100)');

    let leads = { rows: [] };
    let bookings = { rows: [{ count: '0' }] };
    let enquiries = { rows: [{ count: '0' }] };
    let users = { rows: [{ count: '0' }] };
    let plans = { rows: [] };
    let revenueResult = { rows: [{ total: '0' }] };
    let completedInstalls = { rows: [{ count: '0' }] };
    let newLeadsTodayResult = { rows: [{ count: '0' }] };
    let recentBookings = { rows: [] };

    try {
      leads = await query('SELECT COUNT(*)::int as count, COALESCE(status, \'new\') as status FROM leads GROUP BY status');
    } catch (e) {
      console.error('Leads query error:', e.message);
    }

    try {
      const bookingsResult = await query('SELECT COUNT(*)::int as count FROM bookings');
      bookings = { rows: [bookingsResult.rows[0] || { count: 0 }] };
    } catch (e) {
      console.error('Bookings query error:', e.message);
    }

    try {
      const enquiriesResult = await query('SELECT COUNT(*)::int as count FROM contact_enquiries');
      enquiries = { rows: [enquiriesResult.rows[0] || { count: 0 }] };
    } catch (e) {
      console.error('Enquiries query error:', e.message);
    }

    try {
      const usersResult = await query('SELECT COUNT(*)::int as count FROM users WHERE role = $1', ['customer']);
      users = { rows: [usersResult.rows[0] || { count: 0 }] };
    } catch (e) {
      console.error('Users query error:', e.message);
    }

    try {
      plans = await query('SELECT * FROM plans');
    } catch (e) {
      console.error('Plans query error:', e.message);
    }

    try {
      const revenueRes = await query('SELECT COALESCE(SUM(p.price), 0)::int as total FROM bookings b JOIN plans p ON b.plan_id = p.id WHERE b.installation_status = $1', ['completed']);
      revenueResult = { rows: [revenueRes.rows[0] || { total: 0 }] };
    } catch (e) {
      console.error('Revenue query error:', e.message);
    }

    try {
      const completedRes = await query('SELECT COUNT(*)::int as count FROM bookings WHERE installation_status = $1', ['completed']);
      completedInstalls = { rows: [completedRes.rows[0] || { count: 0 }] };
    } catch (e) {
      console.error('Completed installs query error:', e.message);
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const newLeadsRes = await query('SELECT COUNT(*)::int as count FROM leads WHERE DATE(created_at) = $1 AND status = $2', [today, 'new']);
      newLeadsTodayResult = { rows: [newLeadsRes.rows[0] || { count: 0 }] };
    } catch (e) {
      console.error('New leads query error:', e.message);
    }

    try {
      const bookingsRes = await query(`
        SELECT b.*, u.name as customer_name, u.email, u.phone, u.city, p.name as plan_name 
        FROM bookings b 
        LEFT JOIN users u ON b.user_id = u.id 
        LEFT JOIN plans p ON b.plan_id = p.id 
        ORDER BY b.created_at DESC LIMIT 10
      `);
      recentBookings = { rows: bookingsRes.rows || [] };
    } catch (e) {
      console.error('Recent bookings query error:', e.message);
      try {
        const bookingsRes = await query(`
          SELECT b.*, u.name as customer_name, u.email, u.phone, p.name as plan_name 
          FROM bookings b 
          LEFT JOIN users u ON b.user_id = u.id 
          LEFT JOIN plans p ON b.plan_id = p.id 
          ORDER BY b.created_at DESC LIMIT 10
        `);
        recentBookings = { rows: bookingsRes.rows || [] };
      } catch (e2) {
        console.error('Fallback bookings query error:', e2.message);
      }
    }

    const totalLeads = (leads.rows || []).reduce((sum, l) => sum + (l.count || 0), 0);
    const wonLeads = (leads.rows || []).find(l => l.status === 'won')?.count || 0;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

    res.json({
      leads: leads.rows || [],
      totalBookings: bookings.rows[0]?.count || 0,
      totalEnquiries: enquiries.rows[0]?.count || 0,
      totalCustomers: users.rows[0]?.count || 0,
      totalRevenue: revenueResult.rows[0]?.total || 0,
      completedInstallations: completedInstalls.rows[0]?.count || 0,
      newLeadsToday: newLeadsTodayResult.rows[0]?.count || 0,
      conversionRate,
      plans: plans.rows || [],
      recentBookings: recentBookings.rows || []
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats', message: error.message });
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const result = await query('SELECT id, email, name, phone, role, city, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, phone, city, password, role = 'customer' } = req.body;
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);
    const result = await query(
      'INSERT INTO users (name, email, phone, city, password, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, name, phone, role, created_at',
      [name, email, phone, city, hashedPassword, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, city } = req.body;
    const result = await query(
      'UPDATE users SET name = $1, email = $2, phone = $3, city = $4 WHERE id = $5 RETURNING id, email, name, phone, role, city, created_at',
      [name, email, phone, city, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
