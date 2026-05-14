import express from 'express';
import cors from 'cors';
import './config/env.js';
import { query } from './config/database.js';
import blogRoutes from './routes/blog.js';
import sitemapRoutes from './routes/sitemap.js';
import authRoutes from './routes/auth.js';
import calculatorRoutes from './routes/calculator.js';
import solarV2Routes from './routes/solarV2.js';
import portalRoutes from './routes/portal.js';
import leadsRoutes from './routes/leads.js';
import adminDataRoutes from './routes/adminData.js';
import { createBlogTable, getBlogCount } from './models/blog.js';
import { createUsersTable, getUserByEmail, createUser } from './models/users.js';
import { seedBlogs } from './scripts/seedBlogs.js';
import bcrypt from 'bcryptjs';

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://greenhybridpower.in', 'https://e4a13a5e.solar-app.pages.dev']
  : ['http://localhost:5173', 'http://localhost:3000', 'https://greenhybridpower.in', 'https://e4a13a5e.solar-app.pages.dev'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/blogs', blogRoutes);
app.use('/api', sitemapRoutes);
app.use('/api/users', authRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/v2/solar', solarV2Routes);
app.use('/api/portal', portalRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/admin', adminDataRoutes);

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

const createAdminTables = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(50),
      city VARCHAR(100),
      service_type VARCHAR(100),
      source VARCHAR(50) DEFAULT 'website',
      status VARCHAR(50) DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      vendor_id INTEGER REFERENCES users(id),
      plan_name VARCHAR(255),
      status VARCHAR(50) DEFAULT 'pending',
      progress_percent INTEGER DEFAULT 0,
      installation_status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      booking_id INTEGER REFERENCES bookings(id),
      amount NUMERIC,
      status VARCHAR(50) DEFAULT 'pending',
      payment_method VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS quotations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      amount NUMERIC,
      description TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      title VARCHAR(255),
      type VARCHAR(100),
      url VARCHAR(1000),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      subject VARCHAR(255),
      message TEXT,
      status VARCHAR(50) DEFAULT 'open',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✓ Admin tables created/verified');
};

const initializeApp = async () => {
  try {
    await createBlogTable();
    await createUsersTable();
    await createAdminTables();
    
    const adminEmail = 'admin@greenhybridpower.in';
    const existingAdmin = await getUserByEmail(adminEmail);
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await createUser({ email: adminEmail, password: hashedPassword, name: 'Admin', role: 'admin' });
      console.log('? Default admin user created (admin@greenhybridpower.in / admin123)');
    } else {
      console.log('? Admin user already exists');
    }
    
    const count = await getBlogCount();
    console.log(`?? Current blog count: ${count}`);
    
    if (count === 0) {
      console.log('?? No blogs found. Starting seed...');
      await seedBlogs();
      const newCount = await getBlogCount();
      console.log(`? Seeding complete! Total blogs: ${newCount}`);
    } else {
      console.log(`? Blog system ready with ${count} existing posts`);
    }
  } catch (err) {
    console.error('? Blog system initialization failed:', err.message);
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`? CORS enabled for origins: ${allowedOrigins.join(', ')}`);
  setTimeout(initializeApp, 500);
});
