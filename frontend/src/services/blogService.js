import axios from 'axios';

const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE)
  ? String(import.meta.env.VITE_API_BASE).replace(/\/$/, '')
  : '';
const API_URL = `${API_BASE}/api/blogs`;

export const blogService = {
  getAll: async (page = 1, limit = 10, category = null) => {
    const params = new URLSearchParams({ page, limit });
    if (category) params.append('category', category);
    const response = await axios.get(`${API_URL}?${params}`);
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await axios.get(`${API_URL}/slug/${slug}`);
    return response.data;
  },

  getByCategory: async (category, page = 1, limit = 10) => {
    const response = await axios.get(`${API_URL}/category/${category}?page=${page}&limit=${limit}`);
    return response.data;
  },

  getRecent: async (limit = 3) => {
    const response = await axios.get(`${API_URL}/recent?limit=${limit}`);
    return response.data;
  },

  getPopular: async (limit = 3) => {
    const response = await axios.get(`${API_URL}/popular?limit=${limit}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  }
};