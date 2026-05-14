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

router.get('/customers', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await query("SELECT id, email, name, phone, created_at FROM users WHERE role = 'client' ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/bookings', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await query(`
      SELECT b.*, u.name as customer_name, u.email, u.phone, v.name as vendor_name
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN users v ON b.vendor_id = v.id
      ORDER BY b.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/bookings/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, progress_percent, installation_status } = req.body;
    const result = await query(
      'UPDATE bookings SET status = $1, progress_percent = $2, installation_status = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [status, progress_percent, installation_status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/payments', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await query(`
      SELECT p.*, u.name as customer_name, b.id as booking_id
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN bookings b ON p.booking_id = b.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/payments/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await query('UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', ['completed', req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/quotations', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await query(`
      SELECT q.*, u.name as customer_name, u.email, u.phone
      FROM quotations q
      LEFT JOIN users u ON q.user_id = u.id
      ORDER BY q.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/quotations', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { user_id, amount, description, status } = req.body;
    const result = await query(
      'INSERT INTO quotations (user_id, amount, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, amount, description, status || 'pending']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;