import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Layout from './components/layout/Layout';
import PublicLayout from './components/layout/PublicLayout';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Vision from './pages/public/Vision';
import Services from './pages/public/Services';
import WhyChooseUs from './pages/public/WhyChooseUs';
import BookInspection from './pages/public/BookInspection';
import Contact from './pages/public/Contact';
import FAQ from './pages/public/FAQ';
import Quote from './pages/public/Quote';
import CustomerEnquiry from './pages/public/CustomerEnquiry';

import Login from './pages/public/Login';
import Register from './pages/public/Register';

import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLeads from './pages/admin/Leads';
import AdminBookings from './pages/admin/Bookings';
import AdminQuotes from './pages/admin/Quotes';
import AdminCustomers from './pages/admin/Customers';
import AdminEnquiries from './pages/admin/Enquiries';
import AdminServices from './pages/admin/Services';
import AdminPlans from './pages/admin/Plans';

import CustomerLayout from './components/layout/CustomerLayout';
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerProfile from './pages/customer/Profile';
import CustomerBookings from './pages/customer/Bookings';
import CustomerQuotes from './pages/customer/Quotes';
import CustomerServices from './pages/customer/Services';
import CustomerMonitoring from './pages/customer/Monitoring';

import Loading from './components/common/Loading';
import ErrorBoundary from './components/common/ErrorBoundary';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/services" element={<Services />} />
          <Route path="/why-choose-us" element={<WhyChooseUs />} />
          <Route path="/book-inspection" element={<BookInspection />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/enquiry" element={<CustomerEnquiry />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="quotes" element={<AdminQuotes />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="plans" element={<AdminPlans />} />
        </Route>

        <Route path="/customer" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout />
          </ProtectedRoute>
        }>
          <Route index element={<CustomerDashboard />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="bookings" element={<CustomerBookings />} />
          <Route path="quotes" element={<CustomerQuotes />} />
          <Route path="services" element={<CustomerServices />} />
          <Route path="monitoring" element={<CustomerMonitoring />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
