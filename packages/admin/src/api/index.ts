import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => {
    const data = res.data;
    if (data.code && data.code !== 200) {
      ElMessage.error(data.message || '请求失败');
      return Promise.reject(data);
    }
    return data.data ?? data;
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      router.push('/login');
      ElMessage.error('登录已过期，请重新登录');
    } else {
      ElMessage.error(err.response?.data?.message || '网络错误');
    }
    return Promise.reject(err);
  },
);

export default api;
