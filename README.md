# Green Hybrid Power - Web Application & PWA

A production-ready, investor-grade web application for Green Hybrid Power - a renewable energy startup offering rooftop solar systems, hybrid solar + wind solutions, battery backup, AMC services, and smart monitoring.

> **Note**: Legacy folders (`server/` and `client/`) from the old codebase have been archived to `_archive/`. Only `frontend/` and `backend/` are actively maintained.

## Current Status (April 2026)

✅ **Production Live**
- Frontend: https://greenhybridpower.in
- Backend: https://solar-app-5l4i.onrender.com
- Blog System: Fully functional with 25 SEO-optimized blogs

✅ **Working Features**
- Public Pages: Home, About, Services, Vision, Why Choose Us, FAQ, Testimonials, Contact
- Solar Calculator: Cost estimation with savings calculation
- Quote Request: Customer inquiry form with booking option
- Blog System: 25 SEO-optimized blogs across 6 categories
- Authentication: Login/Register with role-based access

## Features

- **Public Pages**: Home, About, Vision/Mission, Services, Why Choose Us, FAQ, Testimonials, Contact, Book Inspection, Quote Request
- **Solar Calculator**: Interactive cost and savings calculator
- **Blog System**: 25 SEO blogs with categories, search, and internal linking
- **Admin Dashboard**: Analytics, Lead Management, Bookings, Enquiries, Customers, Plans
- **Customer Dashboard**: Bookings, Service Requests, Energy Monitoring (placeholder)
- **Authentication**: JWT-based with role-based access control (admin/customer)
- **PWA Support**: Offline fallback, install prompt, service worker, manifest.json
- **Responsive**: Mobile-first design with adaptive grids

## SEO Features

- Dynamic sitemap.xml
- Robots.txt with blog inclusion
- Meta tags (title, description, OpenGraph, Twitter Cards)
- Schema.org markup (Article + FAQ)
- 25 optimized blog posts for AdSense readiness

## Tech Stack

- **Frontend**: React 18, Vite, React Router, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express, PostgreSQL (Supabase)
- **Authentication**: JWT with bcrypt password hashing
- **API**: RESTful with express-validator

## Blog Categories

1. Solar Guide
2. Solar Cost
3. Government Subsidy
4. Solar Maintenance
5. Solar Comparison
6. Renewable Energy News

## Project Structure

```
solar_app/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (public, admin, vendor, client)
│   │   ├── routes/         # Route guards
│   │   ├── context/        # React contexts
│   │   ├── services/       # API service
│   │   ├── styles/         # CSS files
│   │   └── App.jsx
│   ├── public/
│   │   ├── manifest.json   # PWA manifest
│   │   ├── sw.js           # Service worker
│   │   └── offline.html
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/         # API routes (including blog)
│   │   ├── models/          # Database schema
│   │   ├── config/         # Database config
│   │   ├── scripts/         # Seed data
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase)
- npm or yarn

### 1. Database Setup

Create a PostgreSQL database and update the Render environment variable:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@host:port/database
```

### 2. Backend Setup

```bash
cd backend
npm install
npm start       # Runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev     # Runs on http://localhost:5173
npm run build    # Production build
```

### 4. Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@greenhybridpower.in | admin123 |
| Customer | customer@example.com | user123 |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/users/register | Register new user |
| POST | /api/users/login | User login |
| GET | /api/users/profile | Get user profile |
| GET | /api/blogs | Get all blogs |
| GET | /api/blogs/slug/:slug | Get blog by slug |
| GET | /api/blogs/category/:category | Get blogs by category |
| GET | /api/sitemap.xml | Dynamic sitemap |

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://greenhybridpower.in
DATABASE_URL=postgresql://postgres:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Frontend (.env)

```env
VITE_API_URL=https://solar-app-5l4i.onrender.com/api
```

## Future Integrations

- Payment Gateway (Razorpay/Paytm)
- CRM Integration
- Email/SMS Notifications (SendGrid/Twilio)
- IoT Device Integration for smart monitoring
- Government subsidy documentation automation

## License

Proprietary - Green Hybrid Power Pvt. Ltd.