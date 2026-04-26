import express from 'express';
import cors from 'cors';
import './config/env.js';
import { query, testConnection } from './config/database.js';
import blogRoutes from './routes/blog.js';
import sitemapRoutes from './routes/sitemap.js';
import { createBlogTable } from './models/blog.js';

const app = express();

const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === 'https://greenhybridpower.in') {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

app.use(cors({
  origin: 'https://greenhybridpower.in',
  credentials: true,
}));

app.use(express.json());

app.use('/api/blogs', blogRoutes);
app.use('/api', sitemapRoutes);

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

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('WARNING: Database connection failed. Some features may not work.');
  }
  
  try {
    await createBlogTable();
    console.log('✓ Blog system initialized');
  } catch (err) {
    console.error('✗ Blog table creation failed:', err.message);
  }
});