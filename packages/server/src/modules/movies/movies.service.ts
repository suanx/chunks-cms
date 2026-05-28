import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Episode } from './entities/episode.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    const { categoryIds, ...movieData } = createMovieDto;
    const movie = this.movieRepository.create(movieData);

    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoryRepository.findByIds(categoryIds);
      movie.categories = categories;
    }

    return this.movieRepository.save(movie);
  }

  async findAll(queryDto: QueryMovieDto) {
    const { page, pageSize, keyword, categoryId, type, status, region, sortBy, sortOrder } = queryDto;
    const qb = this.movieRepository.createQueryBuilder('movie');
    qb.leftJoinAndSelect('movie.categories', 'category');

    if (keyword) {
      qb.where('movie.title LIKE :keyword', { keyword: `%${keyword}%` });
    }

    if (categoryId) {
      qb.innerJoin('movie.categories', 'filterCategory', 'filterCategory.id = :categoryId', { categoryId });
    }

    if (type !== undefined && type !== null) {
      qb.andWhere('movie.type = :type', { type });
    }

    if (status !== undefined && status !== null) {
      qb.andWhere('movie.status = :status', { status });
    }

    if (region) {
      qb.andWhere('movie.region = :region', { region });
    }

    const orderField = sortBy || 'sortOrder';
    const orderDir = sortOrder || 'DESC';
    qb.orderBy(`movie.${orderField}`, orderDir);

    const [list, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total, page, pageSize };
  }

  async findOne(id: number) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['categories', 'episodes'],
    });
    if (!movie) {
      throw new NotFoundException('影视不存在');
    }
    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.findOne(id);
    const { categoryIds, ...movieData } = updateMovieDto;

    Object.assign(movie, movieData);

    if (categoryIds !== undefined) {
      const categories = await this.categoryRepository.findByIds(categoryIds);
      movie.categories = categories;
    }

    return this.movieRepository.save(movie);
  }

  async remove(id: number) {
    const movie = await this.findOne(id);
    await this.movieRepository.remove(movie);
    return { message: '删除成功' };
  }

  // Episode management
  async addEpisode(movieId: number, episodeData: Partial<Episode>) {
    const movie = await this.findOne(movieId);
    const episode = this.episodeRepository.create({
      ...episodeData,
      movieId,
    });
    const saved = await this.episodeRepository.save(episode);
    // Update total episodes count
    const count = await this.episodeRepository.count({ where: { movieId } });
    await this.movieRepository.update(movieId, { totalEpisodes: count });
    return saved;
  }

  async updateEpisode(episodeId: number, episodeData: Partial<Episode>) {
    const episode = await this.episodeRepository.findOne({ where: { id: episodeId } });
    if (!episode) {
      throw new NotFoundException('剧集不存在');
    }
    Object.assign(episode, episodeData);
    return this.episodeRepository.save(episode);
  }

  async removeEpisode(episodeId: number) {
    const episode = await this.episodeRepository.findOne({ where: { id: episodeId } });
    if (!episode) {
      throw new NotFoundException('剧集不存在');
    }
    const movieId = episode.movieId;
    await this.episodeRepository.remove(episode);
    const count = await this.episodeRepository.count({ where: { movieId } });
    await this.movieRepository.update(movieId, { totalEpisodes: count });
    return { message: '删除成功' };
  }

  async count() {
    return this.movieRepository.count();
  }

  async getTotalViews() {
    const result = await this.movieRepository
      .createQueryBuilder('movie')
      .select('SUM(movie.viewCount)', 'total')
      .getRawOne();
    return parseInt(result?.total || '0', 10);
  }

  // ========== 批量操作 ==========

  async batchUpdateStatus(ids: number[], status: number) {
    return this.dataSource.transaction(async (manager) => {
      await manager.update(Movie, ids, { status });
      return { affected: ids.length };
    });
  }

  async batchDelete(ids: number[]) {
    return this.dataSource.transaction(async (manager) => {
      await manager.delete(Movie, ids);
      return { affected: ids.length };
    });
  }
}

