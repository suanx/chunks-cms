import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Video } from './entities/video.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { QueryVideoDto } from './dto/query-video.dto';
import { RedisService } from '../../redis/redis.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly redisService: RedisService,
    private readonly auditService: AuditService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createVideoDto: CreateVideoDto, userId?: number, ip?: string, userAgent?: string) {
    const { categoryIds, ...videoData } = createVideoDto;

    const video = this.videoRepository.create(videoData);

    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoryRepository.findByIds(categoryIds);
      video.categories = categories;
    }

    const saved = await this.videoRepository.save(video);

    await this.auditService.log({
      userId,
      action: 'create',
      module: 'videos',
      targetId: saved.id,
      detail: `创建视频: ${saved.title}`,
      ip,
      userAgent,
    });

    return saved;
  }

  async findAll(queryDto: QueryVideoDto) {
    const { page, pageSize, keyword, categoryId, status, publishStatus, sortBy, sortOrder } = queryDto;
    const qb = this.videoRepository.createQueryBuilder('video');
    qb.leftJoinAndSelect('video.categories', 'category');

    if (keyword) {
      qb.where('video.title LIKE :keyword', { keyword: `%${keyword}%` });
    }

    if (categoryId) {
      qb.innerJoin('video.categories', 'filterCategory', 'filterCategory.id = :categoryId', { categoryId });
    }

    if (status !== undefined && status !== null) {
      qb.andWhere('video.status = :status', { status });
    }

    if (publishStatus !== undefined && publishStatus !== null) {
      qb.andWhere('video.publishStatus = :publishStatus', { publishStatus });
    }

    const orderField = sortBy || 'createdAt';
    const orderDir = sortOrder || 'DESC';
    qb.orderBy(`video.${orderField}`, orderDir);

    const [list, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total, page, pageSize };
  }

  async findOne(id: number) {
    const video = await this.videoRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!video) {
      throw new NotFoundException('视频不存在');
    }
    return video;
  }

  async update(id: number, updateVideoDto: UpdateVideoDto, userId?: number, ip?: string, userAgent?: string) {
    const video = await this.findOne(id);
    const { categoryIds, ...videoData } = updateVideoDto;

    Object.assign(video, videoData);

    if (categoryIds !== undefined) {
      const categories = await this.categoryRepository.findByIds(categoryIds);
      video.categories = categories;
    }

    const saved = await this.videoRepository.save(video);

    await this.auditService.log({
      userId,
      action: 'update',
      module: 'videos',
      targetId: saved.id,
      detail: `更新视频: ${saved.title}`,
      ip,
      userAgent,
    });

    return saved;
  }

  async remove(id: number, userId?: number, ip?: string, userAgent?: string) {
    const video = await this.findOne(id);
    const title = video.title;
    await this.videoRepository.remove(video);

    await this.auditService.log({
      userId,
      action: 'delete',
      module: 'videos',
      targetId: id,
      detail: `删除视频: ${title}`,
      ip,
      userAgent,
    });

    return { message: '删除成功' };
  }

  async incrementViewCount(id: number): Promise<void> {
    // 用 Redis 计数器缓存播放次数，定期回写数据库
    const key = `video:views:${id}`;
    await this.redisService.incr(key);
    // 每 100 次回写一次数据库
    const count = await this.redisService.get(key);
    if (count && parseInt(count) % 100 === 0) {
      await this.videoRepository.increment({ id }, 'viewCount', 100);
    }
  }

  async flushViewCounts(): Promise<void> {
    // 由定时任务调用，将 Redis 中的播放次数同步到数据库
    const keys = await this.redisService.keys('video:views:*');
    for (const key of keys) {
      const id = parseInt(key.split(':').pop()!);
      const count = await this.redisService.get(key);
      if (count && parseInt(count) > 0) {
        await this.videoRepository.increment({ id }, 'viewCount', parseInt(count));
        await this.redisService.del(key);
      }
    }
  }

  async count() {
    return this.videoRepository.count();
  }

  async getTotalViews() {
    const result = await this.videoRepository
      .createQueryBuilder('video')
      .select('SUM(video.viewCount)', 'total')
      .getRawOne();
    return parseInt(result?.total || '0', 10);
  }

  // ========== 批量操作 ==========

  async batchUpdateStatus(ids: number[], status: number) {
    return this.dataSource.transaction(async (manager) => {
      await manager.update(Video, ids, { status });
      return { affected: ids.length };
    });
  }

  async batchDelete(ids: number[]) {
    return this.dataSource.transaction(async (manager) => {
      await manager.delete(Video, ids);
      return { affected: ids.length };
    });
  }
}
