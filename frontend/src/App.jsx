import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Vision from './pages/public/Vision';
import WhyChooseUs from './pages/public/WhyChooseUs';
import Contact from './pages/public/Contact';
import FAQ from './pages/public/FAQ';
import Testimonials from './pages/public/Testimonials';
import BookInspection from './pages/public/BookInspection';
import QuoteRequest from './pages/public/QuoteRequest';
import SolarCalculator from './pages/public/SolarCalculator';
import Disclaimer from './pages/public/Disclaimer';
import Privacy from './pages/public/Privacy';
import Terms from './pages/public/Terms';

import BlogList from './pages/blog/BlogList';
import BlogDetail from './pages/blog/BlogDetail';
import CategoryPage from './pages/blog/CategoryPage';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

const AdminOverview = React.lazy(() => import('./pages/admin/AdminOverview'));
const AdminCalculator = React.lazy(() => import('./pages/admin/Calculator'));
const AdminLeads = React.lazy(() => import('./pages/admin/Leads'));
const AdminBookings = React.lazy(() => import('./pages/admin/Bookings'));
const AdminEnquiries = React.lazy(() => import('./pages/admin/Enquiries'));
const AdminCustomers = React.lazy(() => import('./pages/admin/Customers'));
const AdminPlans = React.lazy(() => import('./pages/admin/Plans'));
const AdminVendors = React.lazy(() => import('./pages/admin/AdminVendors'));
const AdminQuotations = React.lazy(() => import('./pages/admin/AdminQuotations'));
const AdminPayments = React.lazy(() => import('./pages/admin/AdminPayments'));
const AdminServices = React.lazy(() => import('./pages/admin/AdminServices'));
const AdminDocuments = React.lazy(() => import('./pages/admin/AdminDocuments'));
const AdminSupport = React.lazy(() => import('./pages/admin/AdminSupport'));

const VendorDashboard = React.lazy(() => import('./pages/vendor/Dashboard'));
const VendorLeads = React.lazy(() => import('./pages/vendor/Leads'));
const VendorQuotations = React.lazy(() => import('./pages/vendor/Quotations'));
const VendorBookings = React.lazy(() => import('./pages/vendor/Bookings'));
const VendorInstallations = React.lazy(() => import('./pages/vendor/Installations'));
const VendorPayments = React.lazy(() => import('./pages/vendor/Payments'));
const VendorServices = React.lazy(() => import('./pages/vendor/Services'));
const VendorProfile = React.lazy(() => import('./pages/vendor/Profile'));
const VendorDocuments = React.lazy(() => import('./pages/vendor/Documents'));

const ClientDashboard = React.lazy(() => import('./pages/client/Dashboard'));
const ClientProfile = React.lazy(() => import('./pages/client/Profile'));
const ClientEnquiries = React.lazy(() => import('./pages/client/Enquiries'));
const ClientQuotations = React.lazy(() => import('./pages/client/Quotations'));
const ClientPlanComparison = React.lazy(() => import('./pages/client/PlanComparison'));
const ClientBookings = React.lazy(() => import('./pages/client/Bookings'));
const ClientInstallationProgress = React.lazy(() => import('./pages/client/InstallationProgress'));
const ClientPayments = React.lazy(() => import('./pages/client/Payments'));
const ClientFinance = React.lazy(() => import('./pages/client/Finance'));
const ClientServices = React.lazy(() => import('./pages/client/Services'));
const ClientInvoices = React.lazy(() => import('./pages/client/Invoices'));
const ClientDocuments = React.lazy(() => import('./pages/client/Documents'));
const ClientSupport = React.lazy(() => import('./pages/client/Support'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="vision" element={<Vision />} />
        <Route path="why-choose-us" element={<WhyChooseUs />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="book-inspection" element={<BookInspection />} />
        <Route path="quote-request" element={<QuoteRequest />} />
        <Route path="solar-calculator" element={<SolarCalculator />} />
        <Route path="disclaimer" element={<Disclaimer />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="blog" element={<BlogList />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="blog/category/:category" element={<CategoryPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route element={<Suspense fallback={<div>Loading...</div>}><ProtectedRoute allowedRoles={['admin']} /></Suspense>}>
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminOverview />} />
          <Route path="calculator" element={<AdminCalculator />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="vendors" element={<AdminVendors />} />
          <Route path="quotations" element={<AdminQuotations />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="plans" element={<AdminPlans />} />
        </Route>
      </Route>

      <Route element={<Suspense fallback={<div>Loading...</div>}><ProtectedRoute allowedRoles={['vendor']} /></Suspense>}>
        <Route path="/vendor" element={<DashboardLayout role="vendor" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="leads" element={<VendorLeads />} />
          <Route path="quotations" element={<VendorQuotations />} />
          <Route path="bookings" element={<VendorBookings />} />
          <Route path="installations" element={<VendorInstallations />} />
          <Route path="payments" element={<VendorPayments />} />
          <Route path="services" element={<VendorServices />} />
          <Route path="profile" element={<VendorProfile />} />
          <Route path="documents" element={<VendorDocuments />} />
        </Route>
      </Route>

      <Route element={<Suspense fallback={<div>Loading...</div>}><ProtectedRoute allowedRoles={['client']} /></Suspense>}>
        <Route path="/client" element={<DashboardLayout role="client" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="enquiries" element={<ClientEnquiries />} />
          <Route path="quotations" element={<ClientQuotations />} />
          <Route path="plan-comparison" element={<ClientPlanComparison />} />
          <Route path="bookings" element={<ClientBookings />} />
          <Route path="installation-progress" element={<ClientInstallationProgress />} />
          <Route path="payments" element={<ClientPayments />} />
          <Route path="finance" element={<ClientFinance />} />
          <Route path="services" element={<ClientServices />} />
          <Route path="invoices" element={<ClientInvoices />} />
          <Route path="documents" element={<ClientDocuments />} />
          <Route path="support" element={<ClientSupport />} />
        </Route>
      </Route>

      <Route path="/customer/*" element={<Navigate to="/client/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
