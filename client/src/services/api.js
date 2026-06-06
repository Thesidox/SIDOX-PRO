import axios from 'axios';
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const api = axios.create({ baseURL: BASE });
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
export const authAPI = {
  loginWithCode : (access_code)        => api.post('/api/auth/login', { access_code }),
  loginAdmin    : (username, password) => api.post('/api/auth/login', { username, password }),
  verify        : ()                   => api.post('/api/auth/verify'),
};
export const coursesAPI = {
  getAll : ()   => api.get('/api/courses'),
  getOne : (id) => api.get(`/api/courses/${id}`),
};
export const videosAPI = {
  getByCourse  : (courseId)                     => api.get(`/api/videos/course/${courseId}`),
  saveProgress : (video_id, watched_secs, completed) => api.post('/api/videos/progress', { video_id, watched_secs, completed }),
  getProgress  : (courseId)                     => api.get(`/api/videos/progress/${courseId}`),
};
export const adminAPI = {
  stats          : (pass) => api.get('/api/admin/stats',    { headers:{'x-admin-password':pass} }),
  students       : (pass) => api.get('/api/admin/students', { headers:{'x-admin-password':pass} }),
  generateCodes  : (pass, data) => api.post('/api/admin/generate-codes', data, { headers:{'x-admin-password':pass} }),
  deactivate     : (pass, id)   => api.post(`/api/admin/students/${id}/deactivate`, {}, { headers:{'x-admin-password':pass} }),
  activate       : (pass, id)   => api.post(`/api/admin/students/${id}/activate`,   {}, { headers:{'x-admin-password':pass} }),
  addVideo       : (pass, data) => api.post('/api/admin/videos', data, { headers:{'x-admin-password':pass} }),
  deleteVideo    : (pass, id)   => api.delete(`/api/admin/videos/${id}`, { headers:{'x-admin-password':pass} }),
  messages       : (pass) => api.get('/api/admin/messages', { headers:{'x-admin-password':pass} }),
};
export const contactAPI = {
  send: (data) => api.post('/api/contact/send', data),
};
export default api;
