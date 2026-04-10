require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const leadRoutes = require('./routes/lead.routes');
const bookingRoutes = require('./routes/booking.routes');
const quoteRoutes = require('./routes/quote.routes');
const planRoutes = require('./routes/plan.routes');
const enquiryRoutes = require('./routes/enquiry.routes');
const serviceRoutes = require('./routes/service.routes');
const profileRoutes = require('./routes/profile.routes');
const monitoringRoutes = require('./routes/monitoring.routes');
const calculatorRoutes = require('./routes/calculator.routes');

const { errorHandler } = require('./middleware/error.middleware');
const { corsConfig } = require('./config/cors');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting server...');

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/calculator', calculatorRoutes);

console.log('\n=== REGISTERED ROUTES ===');
const logRoutes = (layer) => {
  if (layer.route) {
    const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
    console.log(`${methods} ${layer.route.path}`);
  } else if (layer.handle && layer.handle.stack) {
    layer.handle.stack.forEach(logRoutes);
  }
};
app._router.stack.forEach(logRoutes);
console.log('=== END ROUTES ===\n');

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;