import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rcore_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errMsg = (e) => e?.response?.data?.message || e?.message || 'Something went wrong. Please try again.';
// Uploaded images live on the API (/api/images/...). Frontend files like /logo.jpeg stay local.
export const assetUrl = (u) => {
  if (!u) return '';
  if (/^(https?:|data:)/.test(u)) return u;
  return u.startsWith('/api/') ? `${import.meta.env.VITE_ASSET_URL || ''}${u}` : u;
};
export const money = (v, currency = 'PKR') => `${currency} ${Number(v || 0).toLocaleString()}`;
export const groupBy = (items, key = 'category') =>
  items.reduce((acc, item) => {
    const k = item[key] || 'General';
    (acc[k] = acc[k] || []).push(item);
    return acc;
  }, {});

export default api;
