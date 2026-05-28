import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../videos/entities/video.entity';
import { Movie } from '../movies/entities/movie.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async search(keyword: string, page = 1, pageSize = 20) {
    if (!keyword || keyword.trim() === '') {
      return { videos: [], movies: [], total: 0 };
    }

    const trimmedKeyword = keyword.trim();

    // Search videos
    const [videos, videoTotal] = await this.videoRepository
      .createQueryBuilder('video')
      .where('video.title LIKE :keyword', { keyword: `%${trimmedKeyword}%` })
      .andWhere('video.status = 1')
      .orderBy('video.viewCount', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    // Search movies
    const [movies, movieTotal] = await this.movieRepository
      .createQueryBuilder('movie')
      .where('movie.title LIKE :keyword', { keyword: `%${trimmedKeyword}%` })
      .andWhere('movie.status = 1')
      .orderBy('movie.viewCount', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      videos,
      movies,
      total: videoTotal + movieTotal,
      videoTotal,
      movieTotal,
    };
  }

  async suggest(keyword: string, limit = 10) {
    if (!keyword || keyword.trim() === '') {
      return [];
    }

    const trimmedKeyword = keyword.trim();

    // Get video suggestions
    const videoSuggestions = await this.videoRepository
      .createQueryBuilder('video')
      .select(['video.id', 'video.title', 'video.coverUrl'])
      .where('video.title LIKE :keyword', { keyword: `%${trimmedKeyword}%` })
      .andWhere('video.status = 1')
      .limit(limit)
      .getMany();

    // Get movie suggestions
    const movieSuggestions = await this.movieRepository
      .createQueryBuilder('movie')
      .select(['movie.id', 'movie.title', 'movie.coverUrl'])
      .where('movie.title LIKE :keyword', { keyword: `%${trimmedKeyword}%` })
      .andWhere('movie.status = 1')
      .limit(limit)
      .getMany();

    const suggestions = [
      ...videoSuggestions.map((v) => ({ ...v, type: 'video' })),
      ...movieSuggestions.map((m) => ({ ...m, type: 'movie' })),
    ].slice(0, limit);

    return suggestions;
  }
}
