import express from 'express';
import cors from 'cors';
import './config/env.js';
import { query } from './config/database.js';
import blogRoutes from './routes/blog.js';
import sitemapRoutes from './routes/sitemap.js';
import authRoutes from './routes/auth.js';
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

const initializeApp = async () => {
  try {
    await createBlogTable();
    await createUsersTable();
    
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
