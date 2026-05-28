import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Video } from '../videos/entities/video.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Comment } from '../comments/entities/comment.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getStats() {
    const [totalUsers, totalVideos, totalMovies, totalComments] = await Promise.all([
      this.userRepository.count(),
      this.videoRepository.count(),
      this.movieRepository.count(),
      this.commentRepository.count(),
    ]);

    // Total views
    const videoViewsResult = await this.videoRepository
      .createQueryBuilder('video')
      .select('SUM(video.viewCount)', 'total')
      .getRawOne();

    const movieViewsResult = await this.movieRepository
      .createQueryBuilder('movie')
      .select('SUM(movie.viewCount)', 'total')
      .getRawOne();

    const totalViews = parseInt(videoViewsResult?.total || '0', 10) + parseInt(movieViewsResult?.total || '0', 10);

    return {
      totalUsers,
      totalVideos,
      totalMovies,
      totalComments,
      totalViews,
    };
  }

  async getTrends(days = 7) {
    const result: any[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      const nextDateStr = nextDate.toISOString().split('T')[0];

      const [newUsers, newVideos, newMovies, newComments] = await Promise.all([
        this.userRepository
          .createQueryBuilder('user')
          .where('user.createdAt >= :startDate AND user.createdAt < :endDate', {
            startDate: dateStr,
            endDate: nextDateStr,
          })
          .getCount(),
        this.videoRepository
          .createQueryBuilder('video')
          .where('video.createdAt >= :startDate AND video.createdAt < :endDate', {
            startDate: dateStr,
            endDate: nextDateStr,
          })
          .getCount(),
        this.movieRepository
          .createQueryBuilder('movie')
          .where('movie.createdAt >= :startDate AND movie.createdAt < :endDate', {
            startDate: dateStr,
            endDate: nextDateStr,
          })
          .getCount(),
        this.commentRepository
          .createQueryBuilder('comment')
          .where('comment.createdAt >= :startDate AND comment.createdAt < :endDate', {
            startDate: dateStr,
            endDate: nextDateStr,
          })
          .getCount(),
      ]);

      result.push({
        date: dateStr,
        newUsers,
        newVideos,
        newMovies,
        newComments,
      });
    }

    return result;
  }

  async getLatestVideos(limit = 10) {
    return this.videoRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      select: ['id', 'title', 'coverUrl', 'viewCount', 'status', 'createdAt'],
    });
  }

  async getLatestUsers(limit = 10) {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      select: ['id', 'username', 'nickname', 'avatar', 'status', 'createdAt'],
    });
    return users;
  }
}
