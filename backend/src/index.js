import express from 'express';
import cors from 'cors';
import './config/env.js';
import { query } from './config/database.js';

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));

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