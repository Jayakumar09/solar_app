import api from './api';

const portalService = {
  getSummary: async () => {
    const response = await api.get('/portal/summary');
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/portal/profile');
    return response.data;
  },
  updateProfile: async (payload) => {
    const response = await api.put('/portal/profile', payload);
    return response.data;
  },
  getDocuments: async () => {
    const response = await api.get('/portal/documents');
    return response.data;
  },
  createDocument: async (payload) => {
    const response = await api.post('/portal/documents', payload);
    return response.data;
  },
  getSupportTickets: async () => {
    const response = await api.get('/portal/support');
    return response.data;
  },
  createSupportTicket: async (payload) => {
    const response = await api.post('/portal/support', payload);
    return response.data;
  },
};

export default portalService;
