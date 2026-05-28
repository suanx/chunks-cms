import api from '../index';

export const getStats = () => api.get('/dashboard/stats');
export const getTrends = (params?: any) => api.get('/dashboard/trends', { params });
