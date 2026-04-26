import pkg from 'pg';
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === 'production';

console.log('🔧 DB ENV:', process.env.NODE_ENV || 'undefined');
console.log('🔧 Using SSL:', isProduction);

// Parse DATABASE_URL to check existing SSL config
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  try {
    const url = new URL(dbUrl);
    console.log('🔧 DB Host:', url.hostname);
    console.log('🔧 DB SSL in URL:', url.searchParams.get('sslmode'));
  } catch (e) {
    console.log('🔧 DB URL parse error:', e.message);
  }
}

// Force override SSL settings for production
const pool = new Pool({
  connectionString: dbUrl,
  ssl: isProduction
    ? {
        rejectUnauthorized: false,
        sslmode: 'require',
      }
    : false,
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
export default pool;