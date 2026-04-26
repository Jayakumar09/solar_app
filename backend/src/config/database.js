import pkg from 'pg';
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? {
    rejectUnauthorized: false
  } : false
});

export const query = async (text, params) => {
  try {
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production') {
      console.log('Executed query', { text: text.substring(0, 50), duration, rows: result.rowCount });
    }
    return result;
  } catch (err) {
    console.error('Database error:', err.message);
    throw err;
  }
};

export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connected successfully');
    return true;
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
    return false;
  }
};

export { pool };