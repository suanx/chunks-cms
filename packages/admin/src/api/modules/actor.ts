import api from '../index';

export const getActors = (params: any) => api.get('/actors', { params });
export const createActor = (data: any) => api.post('/actors', data);
export const updateActor = (id: number, data: any) => api.patch(`/actors/${id}`, data);
export const deleteActor = (id: number) => api.delete(`/actors/${id}`);
