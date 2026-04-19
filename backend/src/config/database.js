import pg from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

console.log("Using DATABASE_URL:", process.env.DATABASE_URL);

if (process.env.DATABASE_URL.includes(":5432") || process.env.DATABASE_URL.includes("db.supabase.co")) {
  console.warn("WARNING: Using direct DB connection. Use Supabase pooler (port 6543) instead.");
}

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
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