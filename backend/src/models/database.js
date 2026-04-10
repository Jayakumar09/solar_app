export const initDatabase = async (pool) => {
  const createTablesSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      city VARCHAR(100),
      role VARCHAR(20) DEFAULT 'customer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'city') THEN
        ALTER TABLE users ADD COLUMN city VARCHAR(100);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'customer';
      END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS customer_profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      address TEXT,
      city VARCHAR(100),
      state VARCHAR(100),
      pincode VARCHAR(10),
      aadhaar_number VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id)
    );

    CREATE TABLE IF NOT EXISTS vendor_profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      company_name VARCHAR(255),
      territory VARCHAR(120),
      specialization VARCHAR(120),
      onboarding_status VARCHAR(50) DEFAULT 'active',
      rating DECIMAL(3,2) DEFAULT 4.5,
      documents_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id)
    );

    CREATE TABLE IF NOT EXISTS plans (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      type VARCHAR(50) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      description TEXT,
      features JSONB,
      image_url TEXT,
      battery_image_url TEXT,
      solar_panel_image_url TEXT,
      inverter_image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      service_type VARCHAR(100),
      city VARCHAR(100),
      address TEXT,
      plan_id INTEGER REFERENCES plans(id),
      monthly_units VARCHAR(50),
      message TEXT,
      source VARCHAR(50) DEFAULT 'website',
      assigned_vendor_id INTEGER REFERENCES users(id),
      status VARCHAR(50) DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      lead_id INTEGER REFERENCES leads(id),
      plan_id INTEGER REFERENCES plans(id),
      vendor_id INTEGER REFERENCES users(id),
      booking_date DATE,
      site_visit_date DATE,
      installation_date DATE,
      progress_percent INTEGER DEFAULT 0,
      inspection_status VARCHAR(50) DEFAULT 'pending',
      installation_status VARCHAR(50) DEFAULT 'pending',
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS quotations (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER REFERENCES bookings(id),
      lead_id INTEGER REFERENCES leads(id),
      plan_id INTEGER REFERENCES plans(id),
      client_id INTEGER REFERENCES users(id),
      vendor_id INTEGER REFERENCES users(id),
      system_size_kw DECIMAL(10,2),
      total_amount DECIMAL(10,2),
      note TEXT,
      validity_date DATE,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      subject VARCHAR(255),
      message TEXT,
      status VARCHAR(50) DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS service_requests (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      booking_id INTEGER REFERENCES bookings(id),
      service_type VARCHAR(100),
      description TEXT,
      status VARCHAR(50) DEFAULT 'requested',
      scheduled_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER REFERENCES bookings(id),
      quotation_id INTEGER REFERENCES quotations(id),
      client_id INTEGER REFERENCES users(id),
      vendor_id INTEGER REFERENCES users(id),
      title VARCHAR(255),
      amount DECIMAL(10,2) NOT NULL,
      payment_stage VARCHAR(50) DEFAULT 'advance',
      due_date DATE,
      paid_date DATE,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS finance_applications (
      id SERIAL PRIMARY KEY,
      client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      lender_name VARCHAR(255),
      scheme_name VARCHAR(255),
      amount_requested DECIMAL(10,2),
      approved_amount DECIMAL(10,2),
      emi DECIMAL(10,2),
      status VARCHAR(50) DEFAULT 'under_review',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER REFERENCES bookings(id),
      client_id INTEGER REFERENCES users(id),
      invoice_number VARCHAR(120) UNIQUE,
      amount DECIMAL(10,2) NOT NULL,
      due_date DATE,
      status VARCHAR(50) DEFAULT 'issued',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      booking_id INTEGER REFERENCES bookings(id),
      title VARCHAR(255) NOT NULL,
      document_type VARCHAR(80) NOT NULL,
      file_name VARCHAR(255),
      file_url TEXT,
      visibility VARCHAR(30) DEFAULT 'private',
      status VARCHAR(50) DEFAULT 'uploaded',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS support_tickets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      booking_id INTEGER REFERENCES bookings(id),
      category VARCHAR(100),
      priority VARCHAR(30) DEFAULT 'medium',
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'open',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_enquiries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      subject VARCHAR(255),
      message TEXT,
      status VARCHAR(50) DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS calculator_saves (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
  inputs JSONB NOT NULL,
  results JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_calculator_saves_created_at ON calculator_saves(created_at);
CREATE INDEX IF NOT EXISTS idx_calculator_saves_lead_id ON calculator_saves(lead_id);

    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      customer_name VARCHAR(255),
      feedback TEXT,
      rating INTEGER DEFAULT 5,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS impact_metrics (
      id SERIAL PRIMARY KEY,
      metric_name VARCHAR(100),
      metric_value DECIMAL(10,2),
      unit VARCHAR(20),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'city') THEN
        ALTER TABLE leads ADD COLUMN city VARCHAR(100);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'address') THEN
        ALTER TABLE leads ADD COLUMN address TEXT;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'plan_id') THEN
        ALTER TABLE leads ADD COLUMN plan_id INTEGER REFERENCES plans(id);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'monthly_units') THEN
        ALTER TABLE leads ADD COLUMN monthly_units VARCHAR(50);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'source') THEN
        ALTER TABLE leads ADD COLUMN source VARCHAR(50) DEFAULT 'website';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'assigned_vendor_id') THEN
        ALTER TABLE leads ADD COLUMN assigned_vendor_id INTEGER REFERENCES users(id);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'vendor_id') THEN
        ALTER TABLE bookings ADD COLUMN vendor_id INTEGER REFERENCES users(id);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'site_visit_date') THEN
        ALTER TABLE bookings ADD COLUMN site_visit_date DATE;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'installation_date') THEN
        ALTER TABLE bookings ADD COLUMN installation_date DATE;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'progress_percent') THEN
        ALTER TABLE bookings ADD COLUMN progress_percent INTEGER DEFAULT 0;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotations' AND column_name = 'lead_id') THEN
        ALTER TABLE quotations ADD COLUMN lead_id INTEGER REFERENCES leads(id);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotations' AND column_name = 'plan_id') THEN
        ALTER TABLE quotations ADD COLUMN plan_id INTEGER REFERENCES plans(id);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotations' AND column_name = 'client_id') THEN
        ALTER TABLE quotations ADD COLUMN client_id INTEGER REFERENCES users(id);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotations' AND column_name = 'vendor_id') THEN
        ALTER TABLE quotations ADD COLUMN vendor_id INTEGER REFERENCES users(id);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotations' AND column_name = 'system_size_kw') THEN
        ALTER TABLE quotations ADD COLUMN system_size_kw DECIMAL(10,2);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotations' AND column_name = 'note') THEN
        ALTER TABLE quotations ADD COLUMN note TEXT;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'image_url') THEN
        ALTER TABLE plans ADD COLUMN image_url TEXT;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'battery_image_url') THEN
        ALTER TABLE plans ADD COLUMN battery_image_url TEXT;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'solar_panel_image_url') THEN
        ALTER TABLE plans ADD COLUMN solar_panel_image_url TEXT;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'inverter_image_url') THEN
        ALTER TABLE plans ADD COLUMN inverter_image_url TEXT;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
    CREATE INDEX IF NOT EXISTS idx_leads_assigned_vendor ON leads(assigned_vendor_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_vendor_id ON bookings(vendor_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_installation_status ON bookings(installation_status);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_quotations_client_id ON quotations(client_id);
    CREATE INDEX IF NOT EXISTS idx_quotations_vendor_id ON quotations(vendor_id);
    CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
    CREATE INDEX IF NOT EXISTS idx_payments_vendor_id ON payments(vendor_id);
    CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
    CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
  `;

  try {
    await pool.query(createTablesSQL);
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
