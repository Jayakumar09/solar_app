import pkg from "pg";
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === "production";

console.log("🔧 DB ENV:", process.env.NODE_ENV || "undefined");
console.log("🔧 Using SSL:", isProduction);
console.log("🔧 DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT SET");

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