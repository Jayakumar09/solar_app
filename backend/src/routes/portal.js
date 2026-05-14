import express from 'express';
import { query } from '../config/database.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

router.get('/summary', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const clients = await query("SELECT COUNT(*) as count FROM users WHERE role = 'client'");
    const vendors = await query("SELECT COUNT(*) as count FROM users WHERE role = 'vendor'");
    const leads = await query("SELECT COUNT(*) as count FROM leads");
    const bookings = await query("SELECT COUNT(*) as count FROM bookings WHERE status = 'active'");
    const payments = await query("SELECT COUNT(*) as count FROM payments WHERE status = 'pending'");
    const quotations = await query("SELECT COUNT(*) as count FROM quotations");
    const revenue = await query("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed'");
    
    const recentBookings = await query(`
      SELECT b.*, u.name as customer_name, v.name as vendor_name
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN users v ON b.vendor_id = v.id
      ORDER BY b.created_at DESC
      LIMIT 6
    `);

    res.json({
      metrics: {
        totalClients: parseInt(clients.rows[0]?.count || 0),
        totalVendors: parseInt(vendors.rows[0]?.count || 0),
        totalLeads: parseInt(leads.rows[0]?.count || 0),
        activeBookings: parseInt(bookings.rows[0]?.count || 0),
        pendingPayments: parseInt(payments.rows[0]?.count || 0),
        totalQuotations: parseInt(quotations.rows[0]?.count || 0),
        monthlyRevenue: parseInt(revenue.rows[0]?.total || 0),
        openTickets: 0
      },
      bookings: recentBookings.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await query('SELECT id, email, name, role, phone, created_at FROM users WHERE id = $1', [req.user.id]);
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;
    await query('UPDATE users SET name = $1, phone = $2, updated_at = NOW() WHERE id = $3', [name, phone, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/documents', authMiddleware, async (req, res) => {
  try {
    const result = await query('SELECT * FROM documents WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/documents', authMiddleware, async (req, res) => {
  try {
    const { title, type, url } = req.body;
    const result = await query('INSERT INTO documents (user_id, title, type, url) VALUES ($1, $2, $3, $4) RETURNING *', [req.user.id, title, type, url]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/support', authMiddleware, async (req, res) => {
  try {
    const result = await query('SELECT * FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/support', authMiddleware, async (req, res) => {
  try {
    const { subject, message } = req.body;
    const result = await query('INSERT INTO support_tickets (user_id, subject, message, status) VALUES ($1, $2, $3, $4) RETURNING *', [req.user.id, subject, message, 'open']);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;