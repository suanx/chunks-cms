import api from '../index';

export const getBanners = (params?: any) => api.get('/banners', { params });
export const createBanner = (data: any) => api.post('/banners', data);
export const updateBanner = (id: number, data: any) => api.patch(`/banners/${id}`, data);
export const deleteBanner = (id: number) => api.delete(`/banners/${id}`);
