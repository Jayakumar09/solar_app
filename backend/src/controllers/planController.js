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
    const { name, type, price, description, features, image_url, battery_image_url, solar_panel_image_url, inverter_image_url } = req.body;
    const result = await query(
      `INSERT INTO plans (name, type, price, description, features, image_url, battery_image_url, solar_panel_image_url, inverter_image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, type, price, description, JSON.stringify(features), image_url || null, battery_image_url || null, solar_panel_image_url || null, inverter_image_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (req, res, next) => {
  try {
    const { name, type, price, description, features, image_url, battery_image_url, solar_panel_image_url, inverter_image_url } = req.body;
    const result = await query(
      `UPDATE plans
       SET name = $1, type = $2, price = $3, description = $4, features = $5,
           image_url = $6, battery_image_url = $7, solar_panel_image_url = $8, inverter_image_url = $9
       WHERE id = $10
       RETURNING *`,
      [
        name,
        type,
        price,
        description,
        JSON.stringify(features || []),
        image_url || null,
        battery_image_url || null,
        solar_panel_image_url || null,
        inverter_image_url || null,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deletePlan = async (req, res, next) => {
  try {
    const result = await query('DELETE FROM plans WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    next(error);
  }
};
