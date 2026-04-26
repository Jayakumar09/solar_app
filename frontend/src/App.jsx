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

import BlogList from './pages/blog/BlogList';
import BlogDetail from './pages/blog/BlogDetail';
import CategoryPage from './pages/blog/CategoryPage';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import AdminOverview from './pages/admin/AdminOverview';
import AdminCalculator from './pages/admin/Calculator';
import AdminLeads from './pages/admin/Leads';
import AdminBookings from './pages/admin/Bookings';
import AdminEnquiries from './pages/admin/Enquiries';
import AdminCustomers from './pages/admin/Customers';
import AdminPlans from './pages/admin/Plans';
import AdminVendors from './pages/admin/AdminVendors';
import AdminQuotations from './pages/admin/AdminQuotations';
import AdminPayments from './pages/admin/AdminPayments';
import AdminServices from './pages/admin/AdminServices';
import AdminDocuments from './pages/admin/AdminDocuments';
import AdminSupport from './pages/admin/AdminSupport';

import VendorDashboard from './pages/vendor/Dashboard';
import VendorLeads from './pages/vendor/Leads';
import VendorQuotations from './pages/vendor/Quotations';
import VendorBookings from './pages/vendor/Bookings';
import VendorInstallations from './pages/vendor/Installations';
import VendorPayments from './pages/vendor/Payments';
import VendorServices from './pages/vendor/Services';
import VendorProfile from './pages/vendor/Profile';
import VendorDocuments from './pages/vendor/Documents';

import ClientDashboard from './pages/client/Dashboard';
import ClientProfile from './pages/client/Profile';
import ClientEnquiries from './pages/client/Enquiries';
import ClientQuotations from './pages/client/Quotations';
import ClientPlanComparison from './pages/client/PlanComparison';
import ClientBookings from './pages/client/Bookings';
import ClientInstallationProgress from './pages/client/InstallationProgress';
import ClientPayments from './pages/client/Payments';
import ClientFinance from './pages/client/Finance';
import ClientServices from './pages/client/Services';
import ClientInvoices from './pages/client/Invoices';
import ClientDocuments from './pages/client/Documents';
import ClientSupport from './pages/client/Support';

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
        <Route path="blog" element={<BlogList />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="blog/category/:category" element={<CategoryPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
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

      <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
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

      <Route element={<ProtectedRoute allowedRoles={['client']} />}>
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
