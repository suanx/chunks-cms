export interface MovieInfo {
  id: number;
  title: string;
  slug?: string;
  originalTitle?: string;
  description?: string;
  coverUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  type: number;
  genre?: string;
  region?: string;
  language?: string;
  releaseYear?: number;
  releaseDate?: string;
  totalEpisodes: number;
  status: number;
  isEnded: boolean;
  rateAvg: number;
  rateCount: number;
  viewCount: number;
  favoriteCount: number;
  sortOrder: number;
  director?: string;
  actorsDesc?: string;
  episodes?: EpisodeInfo[];
  categories?: CategoryInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface EpisodeInfo {
  id: number;
  movieId: number;
  title: string;
  episodeNumber: number;
  seasonNumber: number;
  description?: string;
  videoUrl?: string;
  duration: number;
  coverUrl?: string;
  status: number;
  viewCount: number;
}

export interface CreateMovieParams {
  title: string;
  originalTitle?: string;
  description?: string;
  coverUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  type: number;
  genre?: string;
  region?: string;
  language?: string;
  releaseYear?: number;
  releaseDate?: string;
  totalEpisodes?: number;
  director?: string;
  actorsDesc?: string;
  categoryIds?: number[];
  sortOrder?: number;
}

export interface UpdateMovieParams extends Partial<CreateMovieParams> {
  status?: number;
  isEnded?: boolean;
}

export interface CreateEpisodeParams {
  title: string;
  episodeNumber: number;
  seasonNumber?: number;
  description?: string;
  videoUrl?: string;
  duration?: number;
  coverUrl?: string;
}
