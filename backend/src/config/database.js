import pkg from 'pg';
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === 'production';

console.log('🔧 DB ENV:', process.env.NODE_ENV || 'undefined');
console.log('🔧 Using SSL:', isProduction);

// Parse DATABASE_URL to check and modify SSL config
let dbUrl = process.env.DATABASE_URL;
if (dbUrl && isProduction) {
  try {
    const url = new URL(dbUrl);
    console.log('🔧 DB Host:', url.hostname);
    const currentMode = url.searchParams.get('sslmode');
    console.log('🔧 Current SSL mode in URL:', currentMode);
    
    // Remove any existing sslmode and add our own
    url.searchParams.set('sslmode', 'require');
    dbUrl = url.toString();
    console.log('🔧 Updated DATABASE_URL with sslmode=require');
  } catch (e) {
    console.log('🔧 DB URL parse error:', e.message);
  }
}

const poolConfig = {
  connectionString: dbUrl,
};

if (isProduction) {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

console.log('🔧 Pool SSL config:', poolConfig.ssl);

const pool = new Pool(poolConfig);

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