import pkg from "pg";
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === "production";

// Parse DATABASE_URL for diagnostics (without modifying)
const getDbInfo = () => {
  try {
    const url = new URL(process.env.DATABASE_URL || "");
    return {
      host: url.hostname,
      port: url.port,
      database: url.pathname.replace("/", ""),
      user: url.username,
    };
  } catch (e) {
    return { error: e.message };
  }
};

const dbInfo = getDbInfo();
console.log("🔧 DB ENV:", process.env.NODE_ENV || "undefined");
console.log("🔧 Using SSL:", isProduction);
console.log("🔧 DB Host:", dbInfo.host || "NOT SET");
console.log("🔧 DB Port:", dbInfo.port || "5432");
console.log("🔧 DB Name:", dbInfo.database || "postgres");
console.log("🔧 DB User:", dbInfo.user || "unknown");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? {
        rejectUnauthorized: false,
      }
    : false,
});

pool.query("SELECT NOW()")
  .then(() => console.log("✅ Database connected successfully"))
  .catch(err => console.error("❌ Database connection failed:", err.message));

export const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (err) {
    console.error("Database error:", err.message);
    throw err;
  }
};

export { pool };
export default pool;