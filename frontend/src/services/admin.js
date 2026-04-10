import api from './api';

const adminService = {
  getDashboard: async () => {
    const response = await api.get('/portal/summary');
    return response.data;
  },
  getLeads: async () => {
    const response = await api.get('/leads');
    return response.data;
  },
  updateLeadStatus: async (id, status) => {
    const response = await api.put(`/leads/${id}`, { status });
    return response.data;
  },
  getBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },
  updateBooking: async (id, payload) => {
    const response = await api.put(`/bookings/${id}`, payload);
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  createUser: async (payload) => {
    const response = await api.post('/admin/users', payload);
    return response.data;
  },
  updateUser: async (id, payload) => {
    const response = await api.put(`/admin/users/${id}`, payload);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
  getPlans: async () => {
    const response = await api.get('/plans');
    return response.data;
  },
  createPlan: async (payload) => {
    const response = await api.post('/plans', payload);
    return response.data;
  },
  updatePlan: async (id, payload) => {
    const response = await api.put(`/plans/${id}`, payload);
    return response.data;
  },
  deletePlan: async (id) => {
    const response = await api.delete(`/plans/${id}`);
    return response.data;
  },
  getEnquiries: async () => {
    const response = await api.get('/contact');
    return response.data;
  },
  updateEnquiryStatus: async (id, status) => {
    const response = await api.put(`/contact/${id}`, { status });
    return response.data;
  },
  sendEnquiryReply: async (id, message) => {
    const response = await api.post(`/contact/${id}/reply`, { message });
    return response.data;
  },
  getServices: async () => {
    const response = await api.get('/services');
    return response.data;
  },
};

export default adminService;
