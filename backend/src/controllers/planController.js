import { query } from '../config/database.js';

export const getPlans = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM plans ORDER BY price ASC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const getPlanById = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM plans WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Plan not found' });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const createPlan = async (req, res, next) => {
  try {
    const { name, type, price, description, features } = req.body;
    const result = await query(
      'INSERT INTO plans (name, type, price, description, features) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, type, price, description, JSON.stringify(features)]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
