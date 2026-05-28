import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async createOrUpdate(userId: number, createRatingDto: CreateRatingDto) {
    const { videoId, movieId, score } = createRatingDto;

    // Find existing rating
    const where: any = { userId };
    if (videoId) where.videoId = videoId;
    if (movieId) where.movieId = movieId;

    let rating = await this.ratingRepository.findOne({ where });

    if (rating) {
      rating.score = score;
      await this.ratingRepository.save(rating);
      return { ...rating, message: '评分更新成功' };
    }

    rating = this.ratingRepository.create({
      userId,
      videoId,
      movieId,
      score,
    });
    const saved = await this.ratingRepository.save(rating);
    return { ...saved, message: '评分成功' };
  }

  async getAverage(type: 'video' | 'movie', targetId: number) {
    const column = type === 'video' ? 'videoId' : 'movieId';
    const result = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.score)', 'average')
      .addSelect('COUNT(rating.id)', 'count')
      .where(`rating.${column} = :targetId`, { targetId })
      .getRawOne();

    return {
      average: parseFloat(result?.average || '0') || 0,
      count: parseInt(result?.count || '0', 10),
    };
  }

  async getDistribution(type: 'video' | 'movie', targetId: number) {
    const column = type === 'video' ? 'videoId' : 'movieId';
    const result = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('rating.score', 'score')
      .addSelect('COUNT(rating.id)', 'count')
      .where(`rating.${column} = :targetId`, { targetId })
      .groupBy('rating.score')
      .orderBy('rating.score', 'ASC')
      .getRawMany();

    return result.map((r) => ({
      score: r.score,
      count: parseInt(r.count, 10),
    }));
  }
}
