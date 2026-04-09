import { query } from '../config/database.js';

export const getAllEnquiries = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM enquiries ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createEnquiry = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const result = await query(
      'INSERT INTO enquiries (user_id, subject, message) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, subject, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
