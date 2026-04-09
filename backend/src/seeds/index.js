import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';
import { initDatabase } from '../models/database.js';

const seedData = async () => {
  try {
    await initDatabase(pool);

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await pool.query(`
      INSERT INTO users (email, password, name, phone, role) VALUES
      ('admin@greenhybridpower.in', $1, 'Admin User', '9876543210', 'admin'),
      ('customer@example.com', $2, 'Rajesh Kumar', '9876543211', 'customer'),
      ('priya@example.com', $2, 'Priya Sharma', '9876543212', 'customer')
      ON CONFLICT (email) DO NOTHING
    `, [adminPassword, userPassword]);

    await pool.query(`
      INSERT INTO plans (name, type, price, description, features) VALUES
      ('Basic Solar Kit', 'basic', 45000, 'Perfect for small homes and budget-conscious customers', $1),
      ('Hybrid Solar + Wind', 'hybrid', 95000, 'Combined solar and wind solution for higher energy needs', $2),
      ('Premium Complete Setup', 'premium', 150000, 'Full system with battery backup and smart monitoring', $3)
      ON CONFLICT DO NOTHING
    `, [
      JSON.stringify(['3kW Solar Panel', '1 Battery Unit', 'Basic Inverter', '2 Year Warranty', 'Free Installation']),
      JSON.stringify(['5kW Solar + 1kW Wind', '3 Battery Units', 'Hybrid Inverter', 'Smart Controller', '5 Year Warranty', 'Free AMC']),
      JSON.stringify(['10kW Solar + 2kW Wind', '6 Battery Units', 'Premium Inverter', 'Smart Monitoring App', '10 Year Warranty', 'Priority Support'])
    ]);

    await pool.query(`
      INSERT INTO leads (name, email, phone, service_type, message, status) VALUES
      ('Amit Patel', 'amit@email.com', '9823456789', 'basic', 'Interested in rooftop solar for my 2BHK', 'new'),
      ('Sunita Verma', 'sunita@email.com', '9834567890', 'hybrid', 'Looking for hybrid solution for my factory', 'contacted'),
      ('Rakesh Singh', 'rakesh@email.com', '9845678901', 'premium', 'Want premium setup for my farmhouse', 'quoted')
      ON CONFLICT DO NOTHING
    `);

    await pool.query(`
      INSERT INTO contact_enquiries (name, email, phone, subject, message, status) VALUES
      ('Vikram Joshi', 'vikram@email.com', '9856789012', 'Installation Query', 'When can you send a team for site inspection?', 'new'),
      ('Meera Reddy', 'meera@email.com', '9867890123', 'AMC Query', 'What is the annual maintenance cost?', 'responded')
      ON CONFLICT DO NOTHING
    `);

    await pool.query(`
      INSERT INTO testimonials (customer_name, feedback, rating) VALUES
      ('Colonel (Retd) Suresh Pawar', 'Excellent installation and service. Very professional team.', 5),
      ('Dr. Anjali Mehra', 'Green Hybrid Power transformed our energy costs. Highly recommended!', 5),
      ('Mahesh Thakur', 'Best solar company in Maharashtra. Great after-sales service.', 4)
      ON CONFLICT DO NOTHING
    `);

    await pool.query(`
      INSERT INTO impact_metrics (metric_name, metric_value, unit) VALUES
      ('CO2 Offset', 125.5, 'tons/year'),
      ('Trees Equivalent', 5000, 'trees'),
      ('Homes Powered', 150, 'households'),
      ('KW Installed', 750, 'kW'),
      ('Happy Customers', 350, 'customers')
      ON CONFLICT DO NOTHING
    `);

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
