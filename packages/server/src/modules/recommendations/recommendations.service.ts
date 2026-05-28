import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../videos/entities/video.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Recommendation } from './entities/recommendation.entity';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Video) private videoRepo: Repository<Video>,
    @InjectRepository(Movie) private movieRepo: Repository<Movie>,
    @InjectRepository(Recommendation) private recRepo: Repository<Recommendation>,
  ) {}

  async getHomeRecommendations() {
    const hotVideos = await this.videoRepo.find({
      where: { status: 1 },
      order: { viewCount: 'DESC' },
      take: 12,
    });

    const newMovies = await this.movieRepo.find({
      where: { status: 1 },
      order: { createdAt: 'DESC' },
      take: 8,
    });

    const highRated = await this.movieRepo.find({
      where: { status: 1 },
      order: { rateAvg: 'DESC' },
      take: 8,
    });

    return { hotVideos, newMovies, highRated };
  }

  async getPersonalized(userId: number, viewHistory?: any[]) {
    // 基于观看历史的简单推荐：查找同分类的热门内容
    // 实际生产环境应使用协同过滤算法
    const hotVideos = await this.videoRepo.find({
      where: { status: 1 },
      order: { viewCount: 'DESC' },
      take: 20,
    });

    const recommended = await this.recRepo.find({
      where: { userId, isActive: true },
      order: { sortOrder: 'ASC' },
      take: 20,
    });

    return { hotVideos, recommended };
  }

  async getTrending() {
    const trendingVideos = await this.videoRepo.find({
      where: { status: 1 },
      order: { viewCount: 'DESC' },
      take: 20,
    });

    const trendingMovies = await this.movieRepo.find({
      where: { status: 1 },
      order: { viewCount: 'DESC' },
      take: 20,
    });

    return { trendingVideos, trendingMovies };
  }

  async findAll(params: { page?: number; pageSize?: number; type?: string }) {
    const { page = 1, pageSize = 20, type } = params;
    const where: any = { isActive: true };
    if (type) where.type = type;

    const [list, total] = await this.recRepo.findAndCount({
      where,
      order: { sortOrder: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { list, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }
}
