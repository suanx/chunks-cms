import api from '../index';

export const getComments = (params: any) => api.get('/comments', { params });
export const deleteComment = (id: number) => api.delete(`/comments/${id}`);
