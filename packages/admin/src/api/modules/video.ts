import api from '../index';

export const getVideos = (params: any) => api.get('/videos', { params });
export const getVideo = (id: number) => api.get(`/videos/${id}`);
export const createVideo = (data: any) => api.post('/videos', data);
export const updateVideo = (id: number, data: any) => api.patch(`/videos/${id}`, data);
export const deleteVideo = (id: number) => api.delete(`/videos/${id}`);
