import pg from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const dbUrl = process.env.DATABASE_URL;
console.log("DB URL:", dbUrl);
console.log("DB Port:", dbUrl.includes(':6543') ? '6543 (pooler)' : dbUrl.includes(':5432') ? '5432 (direct)' : 'unknown');

const { Pool } = pg;

export const pool = new Pool({
  connectionString: dbUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 50), duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

export default pool;