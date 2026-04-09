import { query } from '../config/database.js';

export const getLeads = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM leads WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const result = await query(
      'UPDATE leads SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, service_type, message } = req.body;
    const result = await query(
      'INSERT INTO leads (name, email, phone, service_type, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone, service_type, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
