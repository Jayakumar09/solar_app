import pkg from "pg";
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === "production";
const dbSsl = process.env.DB_SSL === "true";

let dbUrl = process.env.DATABASE_URL;

// Strip sslmode from URL to avoid pg-pool conflict with explicit ssl config
if (dbUrl) {
  dbUrl = dbUrl.replace(/[?&]sslmode=[^&]*/, "").replace(/\?$/, "");
}

const isRemoteDb = dbUrl && !/localhost|127\.0\.0\.1/.test(new URL(dbUrl).hostname);

const sslEnabled = isProduction || dbSsl || isRemoteDb;

if (dbUrl) {
  const url = new URL(dbUrl);
  console.log("🔗 DB Host:", url.hostname);
  console.log("🔗 DB Port:", url.port || "5432");
  console.log("🔒 SSL Config:", sslEnabled ? (isProduction ? "Enabled (Relaxed)" : "Enabled") : "Disabled");
} else {
  console.log("⚠️ DATABASE_URL not set - database features disabled");
}

const config = {
  connectionString: dbUrl,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
};

const pool = new Pool(config);

pool.on("error", (err) => {
  console.error("Unexpected pool error:", err.message);
});

export const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (err) {
    console.error("Database query error:", err.message);
    throw err;
  }
};

const testConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query("SELECT NOW()");
      console.log("✅ Database connected successfully");
      return true;
    } catch (err) {
      console.error(`⚠️ Connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  console.error("❌ Database connection failed after retries");
  return false;
};

if (dbUrl) {
  setTimeout(() => testConnection(), 1000);
}

export { pool };
export default pool;
