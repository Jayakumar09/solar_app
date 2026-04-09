# Green Hybrid Power - Web Application & PWA

A production-ready, investor-grade web application for Green Hybrid Power - a renewable energy startup offering rooftop solar systems, hybrid solar + wind solutions, battery backup, AMC services, and smart monitoring.

## Features

- **Public Pages**: Home, About, Vision/Mission, Services, Why Choose Us, FAQ, Testimonials, Contact, Book Inspection, Quote Request
- **Admin Dashboard**: Analytics, Lead Management, Bookings, Enquiries, Customers, Plans
- **Customer Dashboard**: Bookings, Service Requests, Energy Monitoring (placeholder)
- **Authentication**: JWT-based with role-based access control (admin/customer)
- **PWA Support**: Offline fallback, install prompt, service worker, manifest.json
- **Responsive**: Mobile-first design with adaptive grids

## Tech Stack

- **Frontend**: React 18, Vite, React Router, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express, PostgreSQL (Supabase)
- **Authentication**: JWT with bcrypt password hashing
- **API**: RESTful with express-validator, rate limiting, helmet security

## Project Structure

```
solar_app/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── routes/         # Route guards
│   │   ├── context/        # React contexts
│   │   ├── services/       # API service
│   │   ├── styles/         # CSS files
│   │   └── App.jsx
│   ├── public/
│   │   ├── manifest.json   # PWA manifest
│   │   ├── sw.js          # Service worker
│   │   └── offline.html
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, error handling
│   │   ├── models/         # Database schema
│   │   ├── config/         # Database config
│   │   ├── seeds/          # Demo data
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or Supabase)
- npm or yarn

### 1. Database Setup

Create a PostgreSQL database named `greenhybridpower` and update the `.env` file with your connection string:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@localhost:5432/greenhybridpower
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run seed    # Initialize tables and add demo data
npm start       # Runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev     # Runs on http://localhost:5173
```

### 4. Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@greenhybridpower.in | admin123 |
| Customer | customer@example.com | user123 |

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:password@localhost:5432/greenhybridpower
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/users/register | Register new user |
| POST | /api/users/login | User login |
| GET | /api/users/profile | Get user profile |
| GET | /api/admin/dashboard | Admin dashboard stats |
| GET | /api/leads | Get all leads (admin) |
| POST | /api/leads | Create new lead |
| GET | /api/bookings | Get bookings |
| POST | /api/bookings | Create booking |
| GET | /api/plans | Get all plans |
| GET | /api/contact | Get contact enquiries |
| POST | /api/contact | Submit contact form |
| GET | /api/services | Get service requests |
| POST | /api/services | Create service request |

## Future Integrations

- Payment Gateway (Razorpay/Paytm)
- CRM Integration
- Email/SMS Notifications (SendGrid/Twilio)
- IoT Device Integration for smart monitoring
- Government subsidy documentation automation

## License

Proprietary - Green Hybrid Power Pvt. Ltd.