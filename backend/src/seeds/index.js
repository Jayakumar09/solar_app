import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';
import { initDatabase } from '../models/database.js';

const planPlaceholders = {
  basic: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80',
  hybrid: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1200&q=80',
  premium: 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?w=1200&q=80',
  commercial: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&q=80',
  panel: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=1200&q=80',
  inverter: 'https://images.unsplash.com/photo-1624397640148-949b1732bb0a?w=1200&q=80',
  battery: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=1200&q=80',
};

const seedData = async () => {
  try {
    await initDatabase(pool);

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await pool.query(`
      INSERT INTO users (email, password, name, phone, role) VALUES
      ('admin@greenhybridpower.in', $1, 'Admin User', '9876543210', 'admin'),
      ('customer@example.com', $2, 'Rajesh Kumar', '9876543211', 'client'),
      ('priya@example.com', $2, 'Priya Sharma', '9876543212', 'client'),
      ('vendor@greenhybridpower.in', $2, 'SunVolt Partners', '9876543213', 'vendor')
      ON CONFLICT (email) DO NOTHING
    `, [adminPassword, userPassword]);

    await pool.query(`
      INSERT INTO vendor_profiles (user_id, company_name, territory, specialization, onboarding_status, rating, documents_count)
      SELECT id, 'SunVolt Partners', 'Pune West', 'Residential + Hybrid', 'active', 4.7, 6
      FROM users
      WHERE email = 'vendor@greenhybridpower.in'
      ON CONFLICT (user_id) DO NOTHING
    `);

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

    await pool.query(
      `UPDATE plans
       SET image_url = CASE type
         WHEN 'basic' THEN $1
         WHEN 'hybrid' THEN $2
         WHEN 'premium' THEN $3
         WHEN 'commercial' THEN $4
         ELSE image_url
       END,
       solar_panel_image_url = COALESCE(solar_panel_image_url, $5),
       inverter_image_url = COALESCE(inverter_image_url, $6),
       battery_image_url = COALESCE(battery_image_url, $7)
       WHERE image_url IS NULL OR solar_panel_image_url IS NULL OR inverter_image_url IS NULL OR battery_image_url IS NULL`,
      [
        planPlaceholders.basic,
        planPlaceholders.hybrid,
        planPlaceholders.premium,
        planPlaceholders.commercial,
        planPlaceholders.panel,
        planPlaceholders.inverter,
        planPlaceholders.battery,
      ]
    );

    await pool.query(`
      INSERT INTO leads (name, email, phone, service_type, message, status) VALUES
      ('Amit Patel', 'amit@email.com', '9823456789', 'basic', 'Interested in rooftop solar for my 2BHK', 'new'),
      ('Sunita Verma', 'sunita@email.com', '9834567890', 'hybrid', 'Looking for hybrid solution for my factory', 'contacted'),
      ('Rakesh Singh', 'rakesh@email.com', '9845678901', 'premium', 'Want premium setup for my farmhouse', 'quoted')
      ON CONFLICT DO NOTHING
    `);

    await pool.query(`
      UPDATE leads
      SET assigned_vendor_id = (SELECT id FROM users WHERE email = 'vendor@greenhybridpower.in' LIMIT 1)
      WHERE assigned_vendor_id IS NULL
    `);

    await pool.query(`
      INSERT INTO bookings (user_id, lead_id, plan_id, vendor_id, booking_date, site_visit_date, installation_date, progress_percent, inspection_status, installation_status, status)
      SELECT
        (SELECT id FROM users WHERE email = 'customer@example.com'),
        (SELECT id FROM leads ORDER BY id ASC LIMIT 1),
        (SELECT id FROM plans ORDER BY id ASC LIMIT 1),
        (SELECT id FROM users WHERE email = 'vendor@greenhybridpower.in'),
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '2 days',
        CURRENT_DATE + INTERVAL '10 days',
        65,
        'scheduled',
        'in-progress',
        'active'
      WHERE NOT EXISTS (SELECT 1 FROM bookings)
    `);

    await pool.query(`
      INSERT INTO quotations (booking_id, lead_id, plan_id, client_id, vendor_id, system_size_kw, total_amount, note, validity_date, status)
      SELECT
        b.id,
        b.lead_id,
        b.plan_id,
        b.user_id,
        b.vendor_id,
        5.00,
        285000,
        'Includes net metering support and hybrid inverter upgrade.',
        CURRENT_DATE + INTERVAL '15 days',
        'sent'
      FROM bookings b
      WHERE NOT EXISTS (SELECT 1 FROM quotations)
    `);

    await pool.query(`
      INSERT INTO payments (booking_id, quotation_id, client_id, vendor_id, title, amount, payment_stage, due_date, paid_date, status)
      SELECT
        b.id,
        q.id,
        b.user_id,
        b.vendor_id,
        'Advance Payment',
        75000,
        'advance',
        CURRENT_DATE + INTERVAL '5 days',
        NULL,
        'pending'
      FROM bookings b
      LEFT JOIN quotations q ON q.booking_id = b.id
      WHERE NOT EXISTS (SELECT 1 FROM payments)
    `);

    await pool.query(`
      INSERT INTO finance_applications (client_id, lender_name, scheme_name, amount_requested, approved_amount, emi, status)
      SELECT
        id,
        'Surya Capital',
        'Green Rooftop Loan',
        180000,
        160000,
        6250,
        'approved'
      FROM users
      WHERE email = 'customer@example.com'
      AND NOT EXISTS (SELECT 1 FROM finance_applications)
    `);

    await pool.query(`
      INSERT INTO invoices (booking_id, client_id, invoice_number, amount, due_date, status)
      SELECT
        b.id,
        b.user_id,
        'INV-GHP-1001',
        285000,
        CURRENT_DATE + INTERVAL '12 days',
        'issued'
      FROM bookings b
      WHERE NOT EXISTS (SELECT 1 FROM invoices)
    `);

    await pool.query(`
      INSERT INTO documents (user_id, booking_id, title, document_type, file_name, file_url, visibility, status)
      SELECT
        b.user_id,
        b.id,
        'Purchase Agreement',
        'invoice',
        'purchase-agreement.pdf',
        '/docs/purchase-agreement.pdf',
        'client',
        'uploaded'
      FROM bookings b
      WHERE NOT EXISTS (SELECT 1 FROM documents)
    `);

    await pool.query(`
      INSERT INTO support_tickets (user_id, booking_id, category, priority, subject, message, status)
      SELECT
        b.user_id,
        b.id,
        'installation',
        'medium',
        'Need update on inverter dispatch',
        'Please confirm expected arrival date for the inverter shipment.',
        'open'
      FROM bookings b
      WHERE NOT EXISTS (SELECT 1 FROM support_tickets)
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
