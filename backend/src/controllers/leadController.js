import { query } from '../config/database.js';
import { validationResult } from 'express-validator';

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, service_type, city, address, plan_id, monthly_units, message, source } = req.body;
    const result = await query(
      `INSERT INTO leads (name, email, phone, service_type, city, address, plan_id, monthly_units, message, source) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [name, email, phone, service_type, city, address, plan_id, monthly_units, message, source || 'website']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
