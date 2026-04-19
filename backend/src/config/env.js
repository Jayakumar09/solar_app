import { readFileSync, existsSync } from 'fs';
import path from 'path';

const backendDir = process.cwd();
const envPath = path.resolve(backendDir, '.env');

if (!existsSync(envPath)) {
  throw new Error(`.env not found at ${envPath}. Copy .env.example to .env and update DATABASE_URL.`);
}

const envContent = readFileSync(envPath, 'utf-8');
const lines = envContent.split('\n');
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    process.env[key.trim()] = valueParts.join('=').trim();
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env");
}