-- Green Hybrid Power Database Schema for Supabase PostgreSQL

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer', 'staff')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Customer Profiles
CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  aadhaar TEXT,
  gstin TEXT,
  occupation TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plans
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('basic', 'hybrid', 'premium')),
  description TEXT,
  features JSONB DEFAULT '[]',
  price DECIMAL(12, 2),
  capacity TEXT,
  warranty TEXT,
  support TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  service_type TEXT,
  capacity TEXT,
  roof_type TEXT,
  monthly_bill DECIMAL(10, 2),
  message TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'booked', 'lost')),
  assigned_to UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  customer_id UUID REFERENCES users(id),
  plan_id UUID REFERENCES plans(id),
  system_capacity TEXT,
  equipment_cost DECIMAL(12, 2),
  installation_cost DECIMAL(12, 2),
  estimated_amount DECIMAL(12, 2),
  payment_terms TEXT,
  valid_until DATE,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  customer_id UUID REFERENCES users(id),
  service_type TEXT NOT NULL,
  scheduled_date DATE,
  preferred_time TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enquiries
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'responded', 'closed')),
  response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Requests
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  service_type TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  technician_notes TEXT,
  scheduled_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Installations
CREATE TABLE IF NOT EXISTS installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  plan_id UUID REFERENCES plans(id),
  system_capacity TEXT,
  installation_date DATE,
  location TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'inspection')),
  completion_certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Energy Readings (for monitoring)
CREATE TABLE IF NOT EXISTS energy_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id),
  installation_id UUID REFERENCES installations(id),
  reading_time TIMESTAMPTZ DEFAULT NOW(),
  current_power DECIMAL(10, 2),
  energy_generated DECIMAL(10, 2),
  energy_consumed DECIMAL(10, 2),
  today_generation DECIMAL(10, 2),
  today_consumption DECIMAL(10, 2),
  battery_level INTEGER,
  grid_status TEXT DEFAULT 'connected'
);

-- Customer Documents
CREATE TABLE IF NOT EXISTS customer_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id),
  document_type TEXT,
  document_url TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_customer ON quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_energy_readings_customer ON energy_readings(customer_id);
CREATE INDEX IF NOT EXISTS idx_energy_readings_time ON energy_readings(reading_time DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Plans: Public read
CREATE POLICY "Public can view plans" ON plans FOR SELECT USING (is_active = true);

-- Enquiries: Anyone can create, admins can view all
CREATE POLICY "Anyone can create enquiry" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view enquiries" ON enquiries FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Leads: Users can view own, admins can view all
CREATE POLICY "Users can view own leads" ON leads FOR SELECT USING (
  assigned_to = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Customer Profiles: Users can view/update own
CREATE POLICY "Users can view own profile" ON customer_profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON customer_profiles FOR UPDATE USING (user_id = auth.uid());

-- Installations: Users can view own
CREATE POLICY "Users can view own installations" ON installations FOR SELECT USING (customer_id = auth.uid());
