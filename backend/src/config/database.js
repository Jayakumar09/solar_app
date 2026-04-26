import pkg from "pg";
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === "production";

console.log("🔧 DB ENV:", process.env.NODE_ENV || "undefined");
console.log("🔧 Using SSL:", isProduction);

// Parse DATABASE_URL for diagnostics
let dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  try {
    const url = new URL(dbUrl);
    console.log("🔧 DB Host:", url.hostname);
    console.log("🔧 DB Port:", url.port || "5432");
    console.log("🔧 DB Path:", url.pathname);
  } catch (e) {
    console.log("🔧 DB URL parse error:", e.message);
  }
}

const pool = new Pool({
  connectionString: dbUrl,
  ssl: isProduction
    ? {
        rejectUnauthorized: false,
        sslmode: "require",
      }
    : false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});

pool.on("error", (err) => {
  console.error("Unexpected pool error:", err.message);
});

// Test connection with retry
const testConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await pool.query("SELECT NOW()");
      console.log("✅ Database connected successfully");
      return true;
    } catch (err) {
      console.error(`❌ Connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  console.error("❌ Database connection failed after retries");
  return false;
};

// Run initial test
setTimeout(() => testConnection(), 1000);

export const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (err) {
    console.error("Database query error:", err.message);
    throw err;
  }
};

export { pool };
export default pool;