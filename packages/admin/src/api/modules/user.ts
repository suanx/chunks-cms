import api from '../index';

export const getUsers = (params: any) => api.get('/users', { params });
export const updateUserStatus = (id: number, status: number) => api.patch(`/users/${id}/status`, { status });
