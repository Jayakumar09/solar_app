import { query } from '../config/database.js';

export const createUsersTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      role VARCHAR(50) DEFAULT 'customer',
      phone VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

export const getUserByEmail = async (email) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

export const createUser = async ({ email, password, name, role, phone }) => {
  const result = await query(
    'INSERT INTO users (email, password, name, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, role, phone, created_at',
    [email, password, name || '', role || 'customer', phone || '']
  );
  return result.rows[0];
};

export const getUserById = async (id) => {
  const result = await query('SELECT id, email, name, role, phone, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0];
};