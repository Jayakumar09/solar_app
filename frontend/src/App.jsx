import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import PublicRoute from './routes/PublicRoute';
import AdminRoute from './routes/AdminRoute';
import CustomerRoute from './routes/CustomerRoute';
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

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import AdminDashboard from './pages/admin/Dashboard';
import AdminLeads from './pages/admin/Leads';
import AdminBookings from './pages/admin/Bookings';
import AdminEnquiries from './pages/admin/Enquiries';
import AdminCustomers from './pages/admin/Customers';
import AdminPlans from './pages/admin/Plans';

import CustomerDashboard from './pages/customer/Dashboard';
import CustomerBookings from './pages/customer/Bookings';
import CustomerServices from './pages/customer/Services';

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
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute><AdminRoute /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="plans" element={<AdminPlans />} />
      </Route>

      <Route path="/customer" element={<ProtectedRoute><CustomerRoute /></ProtectedRoute>}>
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="bookings" element={<CustomerBookings />} />
        <Route path="services" element={<CustomerServices />} />
      </Route>
    </Routes>
  );
}

export default App;
