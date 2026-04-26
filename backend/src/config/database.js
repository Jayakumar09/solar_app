import pkg from "pg";
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === "production";

console.log("🔧 DB ENV:", process.env.NODE_ENV || "undefined");
console.log("🔧 Using SSL:", isProduction);

// Parse and modify DATABASE_URL to ensure SSL mode
let dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  try {
    const url = new URL(dbUrl);
    console.log("🔧 DB Host:", url.hostname);
    console.log("🔧 DB User:", url.username);
    
    // Force sslmode=require in production
    if (isProduction) {
      url.searchParams.set("sslmode", "require");
      dbUrl = url.toString();
      console.log("🔧 Modified URL with sslmode=require");
    }
  } catch (e) {
    console.error("🔧 DB URL parse error:", e.message);
  }
}

console.log("🔧 DATABASE_URL:", dbUrl ? dbUrl.substring(0, 50) + "..." : "NOT SET");

const pool = new Pool({
  connectionString: dbUrl,
  ssl: isProduction
    ? {
        rejectUnauthorized: false,
        sslmode: "require",
      }
    : false,
});

// Test connection
pool.query("SELECT NOW()")
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

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