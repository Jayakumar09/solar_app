import express from 'express';
import cors from 'cors';
import './config/env.js';
import { query } from './config/database.js';

const app = express();

const allowedOrigins = [
  'https://greenhybridpower.in',
  'https://www.greenhybridpower.in'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://greenhybridpower.in");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const result = await query('SELECT NOW() as now, version() as version');
    res.json({ status: 'ok', now: result.rows[0].now, version: result.rows[0].version });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});