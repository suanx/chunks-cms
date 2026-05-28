import api from '../index';

export const login = (data: { username: string; password: string }) =>
  api.post('/auth/admin/login', data);

export const getProfile = () => api.get('/users/profile');
