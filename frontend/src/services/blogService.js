import axios from 'axios';

const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE)
  ? String(import.meta.env.VITE_API_BASE).replace(/\/$/, '')
  : '';
const API_URL = `${API_BASE}/api/blogs`;

export const blogService = {
  _parseListResponse: (res) => {
    const data = res && res.data !== undefined ? res.data : res;
    const blogs = Array.isArray(data) ? data : (Array.isArray(data?.blogs) ? data.blogs : []);
    return {
      blogs,
      page: data?.page ?? 1,
      totalPages: data?.totalPages ?? 1,
      total: data?.total ?? blogs.length
    };
  },

  getAll: async (page = 1, limit = 10, category = null) => {
    const params = new URLSearchParams({ page, limit });
    if (category) params.append('category', category);
    const response = await axios.get(`${API_URL}?${params}`);
    return blogService._parseListResponse(response);
  },

  getBySlug: async (slug) => {
    const response = await axios.get(`${API_URL}/slug/${slug}`);
    const data = response.data;
    return data?.blog ?? data;
  },

  getByCategory: async (category, page = 1, limit = 10) => {
    const response = await axios.get(`${API_URL}/category/${category}?page=${page}&limit=${limit}`);
    return blogService._parseListResponse(response);
  },

  getRecent: async (limit = 3) => {
    const response = await axios.get(`${API_URL}/recent?limit=${limit}`);
    const data = response.data;
    return Array.isArray(data) ? data : (Array.isArray(data?.blogs) ? data.blogs : []);
  },

  getPopular: async (limit = 3) => {
    const response = await axios.get(`${API_URL}/popular?limit=${limit}`);
    const data = response.data;
    return Array.isArray(data) ? data : (Array.isArray(data?.blogs) ? data.blogs : []);
  },

  getCategories: async () => {
    const response = await axios.get(`${API_URL}/categories`);
    const data = response.data;
    return Array.isArray(data) ? data : (Array.isArray(data?.categories) ? data.categories : []);
  }
};