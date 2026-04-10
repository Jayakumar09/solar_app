import { query } from '../config/database.js';

const normalizeRole = (role) => role === 'customer' ? 'client' : role;

const parseFeatures = (plans = []) => plans.map((plan) => ({
  ...plan,
  features: Array.isArray(plan.features)
    ? plan.features
    : typeof plan.features === 'string'
      ? JSON.parse(plan.features || '[]')
      : [],
}));

const buildAdminSummary = async () => {
  const [plansRes, clientsRes, vendorsRes, leadsRes, bookingsRes, quotesRes, paymentsRes, servicesRes, docsRes, supportRes] = await Promise.all([
    query('SELECT * FROM plans ORDER BY price ASC'),
    query("SELECT id, name, email, phone, city, role, created_at FROM users WHERE role IN ('client', 'customer') ORDER BY created_at DESC"),
    query(`
      SELECT u.id, u.name, u.email, u.phone, u.city, vp.company_name, vp.territory, vp.specialization, vp.onboarding_status, vp.rating, vp.documents_count
      FROM users u
      LEFT JOIN vendor_profiles vp ON vp.user_id = u.id
      WHERE u.role = 'vendor'
      ORDER BY u.created_at DESC
    `),
    query(`
      SELECT l.*, u.name AS vendor_name
      FROM leads l
      LEFT JOIN users u ON u.id = l.assigned_vendor_id
      ORDER BY l.created_at DESC
    `),
    query(`
      SELECT b.*, c.name AS customer_name, c.email, c.phone, c.city, p.name AS plan_name, v.name AS vendor_name
      FROM bookings b
      LEFT JOIN users c ON c.id = b.user_id
      LEFT JOIN users v ON v.id = b.vendor_id
      LEFT JOIN plans p ON p.id = b.plan_id
      ORDER BY b.created_at DESC
    `),
    query(`
      SELECT q.*, p.name AS plan_name, c.name AS client_name, v.name AS vendor_name
      FROM quotations q
      LEFT JOIN plans p ON p.id = q.plan_id
      LEFT JOIN users c ON c.id = q.client_id
      LEFT JOIN users v ON v.id = q.vendor_id
      ORDER BY q.created_at DESC
    `),
    query(`
      SELECT pay.*, c.name AS client_name, v.name AS vendor_name
      FROM payments pay
      LEFT JOIN users c ON c.id = pay.client_id
      LEFT JOIN users v ON v.id = pay.vendor_id
      ORDER BY pay.created_at DESC
    `),
    query(`
      SELECT sr.*, u.name AS customer_name, b.vendor_id
      FROM service_requests sr
      LEFT JOIN users u ON u.id = sr.user_id
      LEFT JOIN bookings b ON b.id = sr.booking_id
      ORDER BY sr.created_at DESC
    `),
    query(`
      SELECT d.*, u.name AS owner_name
      FROM documents d
      LEFT JOIN users u ON u.id = d.user_id
      ORDER BY d.created_at DESC
    `),
    query(`
      SELECT st.*, u.name AS requester_name
      FROM support_tickets st
      LEFT JOIN users u ON u.id = st.user_id
      ORDER BY st.created_at DESC
    `),
  ]);

  const payments = paymentsRes.rows;
  const leads = leadsRes.rows;
  const bookings = bookingsRes.rows;
  const quotes = quotesRes.rows;
  const services = servicesRes.rows;

  return {
    metrics: {
      totalClients: clientsRes.rows.length,
      totalVendors: vendorsRes.rows.length,
      totalLeads: leads.length,
      activeBookings: bookings.filter((booking) => booking.status !== 'completed').length,
      totalQuotations: quotes.length,
      pendingPayments: payments.filter((payment) => payment.status !== 'paid').length,
      openTickets: supportRes.rows.filter((ticket) => ticket.status !== 'closed').length,
      monthlyRevenue: payments
        .filter((payment) => payment.status === 'paid')
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    },
    plans: parseFeatures(plansRes.rows),
    clients: clientsRes.rows,
    vendors: vendorsRes.rows,
    leads,
    bookings,
    quotations: quotes,
    payments,
    services,
    documents: docsRes.rows,
    supportTickets: supportRes.rows,
  };
};

const buildVendorSummary = async (userId) => {
  const [profileRes, leadsRes, bookingsRes, quotesRes, paymentsRes, servicesRes, docsRes] = await Promise.all([
    query(`
      SELECT u.id, u.name, u.email, u.phone, u.city, u.role, vp.company_name, vp.territory, vp.specialization, vp.onboarding_status, vp.rating, vp.documents_count
      FROM users u
      LEFT JOIN vendor_profiles vp ON vp.user_id = u.id
      WHERE u.id = $1
    `, [userId]),
    query(`
      SELECT l.*, c.name AS customer_name, c.phone AS customer_phone
      FROM leads l
      LEFT JOIN users c ON c.id = l.assigned_vendor_id
      WHERE l.assigned_vendor_id = $1
      ORDER BY l.created_at DESC
    `, [userId]),
    query(`
      SELECT b.*, u.name AS client_name, u.phone AS client_phone, p.name AS plan_name
      FROM bookings b
      LEFT JOIN users u ON u.id = b.user_id
      LEFT JOIN plans p ON p.id = b.plan_id
      WHERE b.vendor_id = $1
      ORDER BY b.created_at DESC
    `, [userId]),
    query(`
      SELECT q.*, p.name AS plan_name, u.name AS client_name
      FROM quotations q
      LEFT JOIN plans p ON p.id = q.plan_id
      LEFT JOIN users u ON u.id = q.client_id
      WHERE q.vendor_id = $1
      ORDER BY q.created_at DESC
    `, [userId]),
    query('SELECT * FROM payments WHERE vendor_id = $1 ORDER BY created_at DESC', [userId]),
    query(`
      SELECT sr.*, u.name AS client_name
      FROM service_requests sr
      LEFT JOIN users u ON u.id = sr.user_id
      LEFT JOIN bookings b ON b.id = sr.booking_id
      WHERE b.vendor_id = $1
      ORDER BY sr.created_at DESC
    `, [userId]),
    query('SELECT * FROM documents WHERE user_id = $1 OR visibility = $2 ORDER BY created_at DESC', [userId, 'vendor']),
  ]);

  const bookings = bookingsRes.rows;
  const quotes = quotesRes.rows;
  const payments = paymentsRes.rows;

  return {
    profile: profileRes.rows[0] || null,
    metrics: {
      assignedLeads: leadsRes.rows.length,
      pendingQuotations: quotes.filter((quote) => quote.status !== 'accepted').length,
      activeBookings: bookings.filter((booking) => booking.status !== 'completed').length,
      installationProgressAvg: bookings.length
        ? Math.round(bookings.reduce((sum, booking) => sum + Number(booking.progress_percent || 0), 0) / bookings.length)
        : 0,
      pendingPayments: payments.filter((payment) => payment.status !== 'paid').length,
      openServices: servicesRes.rows.filter((service) => service.status !== 'completed').length,
    },
    leads: leadsRes.rows,
    quotations: quotes,
    bookings,
    installations: bookings.map((booking) => ({
      bookingId: booking.id,
      clientName: booking.client_name,
      siteVisitDate: booking.site_visit_date,
      installationDate: booking.installation_date,
      progressPercent: booking.progress_percent,
      inspectionStatus: booking.inspection_status,
      installationStatus: booking.installation_status,
    })),
    payments,
    services: servicesRes.rows,
    documents: docsRes.rows,
  };
};

const buildClientSummary = async (userId) => {
  const [profileRes, plansRes, bookingsRes, quotesRes, paymentsRes, servicesRes, financeRes, invoicesRes, docsRes, supportRes] = await Promise.all([
    query('SELECT id, email, name, phone, city, role, created_at FROM users WHERE id = $1', [userId]),
    query('SELECT * FROM plans ORDER BY price ASC'),
    query(`
      SELECT b.*, p.name AS plan_name
      FROM bookings b
      LEFT JOIN plans p ON p.id = b.plan_id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `, [userId]),
    query(`
      SELECT q.*, p.name AS plan_name
      FROM quotations q
      LEFT JOIN plans p ON p.id = q.plan_id
      WHERE q.client_id = $1
      ORDER BY q.created_at DESC
    `, [userId]),
    query('SELECT * FROM payments WHERE client_id = $1 ORDER BY created_at DESC', [userId]),
    query('SELECT * FROM service_requests WHERE user_id = $1 ORDER BY created_at DESC', [userId]),
    query('SELECT * FROM finance_applications WHERE client_id = $1 ORDER BY created_at DESC', [userId]),
    query('SELECT * FROM invoices WHERE client_id = $1 ORDER BY created_at DESC', [userId]),
    query('SELECT * FROM documents WHERE user_id = $1 OR visibility = $2 ORDER BY created_at DESC', [userId, 'client']),
    query('SELECT * FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC', [userId]),
  ]);

  const bookings = bookingsRes.rows;
  const payments = paymentsRes.rows;

  return {
    profile: profileRes.rows[0] || null,
    metrics: {
      activeEnquiries: quotesRes.rows.filter((quote) => quote.status === 'sent').length,
      openBookings: bookings.filter((booking) => booking.status !== 'completed').length,
      pendingPayments: payments.filter((payment) => payment.status !== 'paid').length,
      serviceRequests: servicesRes.rows.length,
    },
    enquiries: bookings.map((booking) => ({
      id: booking.lead_id || booking.id,
      title: booking.plan_name || 'Solar Enquiry',
      status: booking.status,
      created_at: booking.created_at,
    })),
    quotations: quotesRes.rows,
    plans: parseFeatures(plansRes.rows),
    bookings,
    installationProgress: bookings.map((booking) => ({
      bookingId: booking.id,
      planName: booking.plan_name,
      progressPercent: booking.progress_percent,
      inspectionStatus: booking.inspection_status,
      installationStatus: booking.installation_status,
      siteVisitDate: booking.site_visit_date,
      installationDate: booking.installation_date,
    })),
    payments,
    finance: financeRes.rows,
    services: servicesRes.rows,
    invoices: invoicesRes.rows,
    documents: docsRes.rows,
    supportTickets: supportRes.rows,
  };
};

export const getPortalSummary = async (req, res, next) => {
  try {
    const role = normalizeRole(req.user.role);
    if (role === 'admin') {
      return res.json({ role, ...(await buildAdminSummary()) });
    }
    if (role === 'vendor') {
      return res.json({ role, ...(await buildVendorSummary(req.user.id)) });
    }
    return res.json({ role: 'client', ...(await buildClientSummary(req.user.id)) });
  } catch (error) {
    next(error);
  }
};

export const getPortalProfile = async (req, res, next) => {
  try {
    const role = normalizeRole(req.user.role);
    const baseProfile = await query('SELECT id, email, name, phone, city, role FROM users WHERE id = $1', [req.user.id]);
    if (role === 'vendor') {
      const vendorProfile = await query('SELECT company_name, territory, specialization, onboarding_status, rating, documents_count FROM vendor_profiles WHERE user_id = $1', [req.user.id]);
      return res.json({ ...baseProfile.rows[0], ...vendorProfile.rows[0] });
    }
    res.json(baseProfile.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updatePortalProfile = async (req, res, next) => {
  try {
    const role = normalizeRole(req.user.role);
    const { name, phone, city, company_name, territory, specialization } = req.body;
    const userRes = await query(
      'UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone), city = COALESCE($3, city) WHERE id = $4 RETURNING id, email, name, phone, city, role',
      [name, phone, city, req.user.id]
    );

    if (role === 'vendor') {
      await query(`
        INSERT INTO vendor_profiles (user_id, company_name, territory, specialization)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id) DO UPDATE
        SET company_name = COALESCE(EXCLUDED.company_name, vendor_profiles.company_name),
            territory = COALESCE(EXCLUDED.territory, vendor_profiles.territory),
            specialization = COALESCE(EXCLUDED.specialization, vendor_profiles.specialization)
      `, [req.user.id, company_name, territory, specialization]);
    }

    res.json(userRes.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getPortalDocuments = async (req, res, next) => {
  try {
    const role = normalizeRole(req.user.role);
    let docsRes;

    if (role === 'admin') {
      docsRes = await query('SELECT * FROM documents ORDER BY created_at DESC');
    } else if (role === 'vendor') {
      docsRes = await query('SELECT * FROM documents WHERE user_id = $1 OR visibility = $2 ORDER BY created_at DESC', [req.user.id, 'vendor']);
    } else {
      docsRes = await query('SELECT * FROM documents WHERE user_id = $1 OR visibility = $2 ORDER BY created_at DESC', [req.user.id, 'client']);
    }

    res.json(docsRes.rows);
  } catch (error) {
    next(error);
  }
};

export const createPortalDocument = async (req, res, next) => {
  try {
    const { booking_id = null, title, document_type, file_name, file_url = '', visibility = 'private' } = req.body;
    const result = await query(
      `INSERT INTO documents (user_id, booking_id, title, document_type, file_name, file_url, visibility)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, booking_id, title, document_type, file_name, file_url, visibility]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getSupportTickets = async (req, res, next) => {
  try {
    const role = normalizeRole(req.user.role);
    let tickets;

    if (role === 'admin') {
      tickets = await query('SELECT * FROM support_tickets ORDER BY created_at DESC');
    } else {
      tickets = await query('SELECT * FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    }

    res.json(tickets.rows);
  } catch (error) {
    next(error);
  }
};

export const createSupportTicket = async (req, res, next) => {
  try {
    const { booking_id = null, category = 'general', priority = 'medium', subject, message } = req.body;
    const result = await query(
      `INSERT INTO support_tickets (user_id, booking_id, category, priority, subject, message)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, booking_id, category, priority, subject, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateSupportTicket = async (req, res, next) => {
  try {
    const result = await query(
      'UPDATE support_tickets SET status = COALESCE($1, status), priority = COALESCE($2, priority) WHERE id = $3 RETURNING *',
      [req.body.status, req.body.priority, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Support ticket not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
