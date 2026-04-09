import { query } from '../config/database.js';

export const createContactEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const result = await query(
      'INSERT INTO contact_enquiries (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone, subject, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getContactEnquiries = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM contact_enquiries ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};
