export const useVideo = () => {
  const { api } = useApi();

  const getVideos = (params: any) => api.get('/videos', params);
  const getVideo = (id: number) => api.get(`/videos/${id}`);
  const getMovies = (params: any) => api.get('/movies', params);
  const getMovie = (id: number) => api.get(`/movies/${id}`);
  const getBanners = () => api.get('/banners', { position: 'home', isActive: 1 });
  const search = (keyword: string) => api.get('/search', { keyword });

  return { getVideos, getVideo, getMovies, getMovie, getBanners, search };
};
