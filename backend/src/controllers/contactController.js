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

export const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const checkResult = await query('SELECT id FROM contact_enquiries WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Contact enquiry not found' });
    }
    const result = await query(
      'UPDATE contact_enquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const replyContactEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message, status } = req.body;
    const checkResult = await query('SELECT id FROM contact_enquiries WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Contact enquiry not found' });
    }
    const updateStatus = status || 'responded';
    const result = await query(
      'UPDATE contact_enquiries SET status = $1 WHERE id = $2 RETURNING *',
      [updateStatus, id]
    );
    res.json({ ...result.rows[0], reply: message });
  } catch (error) {
    next(error);
  }
};
