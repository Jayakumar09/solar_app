import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL not set - database features disabled");
}

export const config = {
  port: process.env.PORT || 5000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};