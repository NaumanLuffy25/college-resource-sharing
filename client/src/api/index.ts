import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.put('/auth/change-password', data),
  forgotPassword: (data: any) => api.post('/auth/forgot-password', data),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
  getAllUsers: (params?: any) => api.get('/auth/admin/users', { params }),
  updateUserRole: (id: string, role: string) => api.put(`/auth/admin/users/${id}/role`, { role }),
  deleteUser: (id: string) => api.delete(`/auth/admin/users/${id}`),
};

export const resourceAPI = {
  upload: (data: FormData) => api.post('/resources', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params?: any) => api.get('/resources', { params }),
  getById: (id: string) => api.get(`/resources/${id}`),
  update: (id: string, data: any) => api.put(`/resources/${id}`, data),
  delete: (id: string) => api.delete(`/resources/${id}`),
  download: (id: string) => api.get(`/resources/${id}/download`, { responseType: 'blob' }),
  addReview: (id: string, data: any) => api.post(`/resources/${id}/reviews`, data),
  getMyResources: (params?: any) => api.get('/resources/my-resources', { params }),
  getRecommendations: () => api.get('/resources/recommendations'),
  getSimilar: (id: string) => api.get(`/resources/${id}/similar`),
  getTrending: () => api.get('/resources/trending'),
  getDashboardStats: () => api.get('/resources/dashboard/stats'),
  approve: (id: string) => api.put(`/resources/${id}/approve`),
  getPending: () => api.get('/resources/pending'),
  getAdminStats: () => api.get('/resources/admin/stats'),
};

export const bookmarkAPI = {
  getAll: (params?: any) => api.get('/bookmarks', { params }),
  add: (data: any) => api.post('/bookmarks', data),
  remove: (resourceId: string) => api.delete(`/bookmarks/${resourceId}`),
  getLeaderboard: () => api.get('/bookmarks/leaderboard'),
};

export default api;
