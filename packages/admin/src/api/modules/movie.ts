import api from '../index';

export const getMovies = (params: any) => api.get('/movies', { params });
export const getMovie = (id: number) => api.get(`/movies/${id}`);
export const createMovie = (data: any) => api.post('/movies', data);
export const updateMovie = (id: number, data: any) => api.patch(`/movies/${id}`, data);
export const deleteMovie = (id: number) => api.delete(`/movies/${id}`);
