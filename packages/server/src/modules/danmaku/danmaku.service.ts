import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Danmaku } from './entities/danmaku.entity';

@Injectable()
export class DanmakuService {
  constructor(
    @InjectRepository(Danmaku)
    private readonly danmakuRepo: Repository<Danmaku>,
  ) {}

  async create(data: {
    videoId: number;
    userId?: number;
    content: string;
    timePoint: number;
    mode?: string;
    color?: string;
    fontSize?: string;
  }) {
    return this.danmakuRepo.save(this.danmakuRepo.create(data));
  }

  async findByVideo(videoId: number, start?: number, end?: number) {
    const qb = this.danmakuRepo
      .createQueryBuilder('d')
      .where('d.videoId = :videoId AND d.isBlocked = false', { videoId });

    if (start !== undefined) {
      qb.andWhere('d.timePoint >= :start', { start });
    }
    if (end !== undefined) {
      qb.andWhere('d.timePoint <= :end', { end });
    }

    return qb.orderBy('d.timePoint', 'ASC').getMany();
  }

  async delete(id: number) {
    await this.danmakuRepo.delete(id);
  }

  async findAll(params: { page?: number; pageSize?: number; videoId?: number }) {
    const { page = 1, pageSize = 20, videoId } = params;
    const where: any = {};
    if (videoId !== undefined) where.videoId = videoId;

    const [list, total] = await this.danmakuRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }
}
