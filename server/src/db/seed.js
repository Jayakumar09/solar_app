require('dotenv').config();
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const seedData = async () => {
  console.log('Starting database seed...');

  // Create admin user
  const adminId = uuidv4();
  const adminPassword = await bcrypt.hash('admin123', 12);

  const { error: adminError } = await supabase.from('users').upsert({
    id: adminId,
    email: 'admin@greenhybridpower.in',
    password_hash: adminPassword,
    name: 'Admin User',
    phone: '+91 9876543210',
    role: 'admin',
    created_at: new Date().toISOString()
  }, { onConflict: 'email' });

  if (adminError && adminError.code !== '23505') {
    console.error('Admin creation error:', adminError);
  } else {
    console.log('Admin user created/exists');
  }

  // Create demo customer
  const customerId = uuidv4();
  const customerPassword = await bcrypt.hash('customer123', 12);

  const { error: customerError } = await supabase.from('users').upsert({
    id: customerId,
    email: 'customer@demo.com',
    password_hash: customerPassword,
    name: 'Rajesh Kumar',
    phone: '+91 9876543211',
    role: 'customer',
    created_at: new Date().toISOString()
  }, { onConflict: 'email' });

  if (customerError && customerError.code !== '23505') {
    console.error('Customer creation error:', customerError);
  } else {
    console.log('Demo customer created/exists');
  }

  // Create customer profile
  await supabase.from('customer_profiles').upsert({
    user_id: customerId,
    full_name: 'Rajesh Kumar',
    phone: '+91 9876543211',
    address: '123 MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    occupation: 'Business',
    created_at: new Date().toISOString()
  }, { onConflict: 'user_id' });

  // Create plans
  const plans = [
    {
      id: uuidv4(),
      name: 'Basic Solar',
      type: 'basic',
      description: 'Perfect for budget-conscious homes looking to reduce electricity bills with reliable solar power.',
      features: ['3kW - 5kW System', 'Polycrystalline Panels', '5 Year Warranty', 'Basic Monitoring App', 'Free Installation', 'Net Metering Support'],
      price: 150000,
      capacity: '3-5 kW',
      warranty: '5 Years on Panels, 2 Years on Inverter',
      support: 'Email & Phone Support',
      sort_order: 1,
      is_active: true
    },
    {
      id: uuidv4(),
      name: 'Hybrid Solar + Wind',
      type: 'hybrid',
      description: 'Advanced hybrid solution combining solar panels with small wind turbine for consistent renewable energy.',
      features: ['5kW Solar + 1kW Wind', 'Monocrystalline Panels', 'Mini Wind Turbine', '10 Year Warranty', 'Smart Monitoring', 'Battery Backup Included', '24/7 Support'],
      price: 350000,
      capacity: '5kW Solar + 1kW Wind',
      warranty: '10 Years on Panels, 5 Years on System',
      support: '24/7 Priority Support',
      sort_order: 2,
      is_active: true
    },
    {
      id: uuidv4(),
      name: 'Premium Complete',
      type: 'premium',
      description: 'Ultimate energy solution with premium components, battery storage, and comprehensive maintenance.',
      features: ['10kW+ System', 'Premium Tier-1 Panels', 'Large Battery Bank', 'Wind Turbine Option', '15 Year Warranty', 'Smart Home Integration', 'Annual AMC', 'Dedicated Account Manager'],
      price: 750000,
      capacity: '10kW+',
      warranty: '15 Years Comprehensive',
      support: 'Dedicated Manager + 24/7 Support',
      sort_order: 3,
      is_active: true
    }
  ];

  for (const plan of plans) {
    await supabase.from('plans').upsert(plan, { onConflict: 'id' });
  }
  console.log('Plans created/updated');

  // Create sample leads
  const leads = [
    {
      id: uuidv4(),
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      phone: '+91 9823456789',
      address: '45 Nehru Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411018',
      service_type: 'hybrid',
      capacity: '5kW',
      roof_type: 'flat',
      monthly_bill: 8000,
      message: 'Interested in hybrid solution for my bungalow',
      source: 'website',
      status: 'qualified',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: uuidv4(),
      name: 'Priya Sharma',
      email: 'priya.s@company.in',
      phone: '+91 9834567890',
      address: '78 Industrial Area',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380001',
      service_type: 'premium',
      capacity: '10kW',
      roof_type: 'sloped',
      monthly_bill: 15000,
      message: 'Looking for complete solution for factory',
      source: 'google',
      status: 'new',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: uuidv4(),
      name: 'Vikram Singh',
      email: 'vikram.singh@email.com',
      phone: '+91 9845678901',
      address: '12 Lake View Colony',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001',
      service_type: 'basic',
      capacity: '3kW',
      roof_type: 'flat',
      monthly_bill: 4000,
      message: 'Need solar for home backup',
      source: 'referral',
      status: 'contacted',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  for (const lead of leads) {
    await supabase.from('leads').insert(lead);
  }
  console.log('Sample leads created');

  // Create sample enquiries
  const enquiries = [
    {
      id: uuidv4(),
      name: 'Suresh Rao',
      email: 'suresh.rao@email.com',
      phone: '+91 9856789012',
      subject: 'AMC Query',
      message: 'What is the annual maintenance cost after warranty expires?',
      status: 'new',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: uuidv4(),
      name: 'Meera Joshi',
      email: 'meera.j@email.com',
      subject: 'Installation Timeline',
      message: 'How long does it take to install a 5kW system?',
      status: 'responded',
      response: 'Typically 3-5 working days after site inspection.',
      responded_at: new Date().toISOString(),
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  for (const enquiry of enquiries) {
    await supabase.from('enquiries').insert(enquiry);
  }
  console.log('Sample enquiries created');

  console.log('Database seed completed successfully!');
  process.exit(0);
};

seedData().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
