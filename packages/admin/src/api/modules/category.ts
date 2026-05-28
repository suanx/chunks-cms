import api from '../index';

export const getCategories = (params?: any) => api.get('/categories', { params });
export const getCategoryTree = () => api.get('/categories/tree');
export const createCategory = (data: any) => api.post('/categories', data);
export const updateCategory = (id: number, data: any) => api.patch(`/categories/${id}`, data);
export const deleteCategory = (id: number) => api.delete(`/categories/${id}`);
