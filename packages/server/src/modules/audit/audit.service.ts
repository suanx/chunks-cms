import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit.entity';
import { Review } from './entities/review.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  async log(data: {
    userId?: number;
    action: string;
    module?: string;
    targetType?: string;
    targetId?: number;
    detail?: string;
    ip?: string;
    userAgent?: string;
  }) {
    const log = this.auditLogRepository.create(data);
    return this.auditLogRepository.save(log);
  }

  async findAll(params: {
    page?: number;
    pageSize?: number;
    userId?: number;
    action?: string;
    module?: string;
    targetType?: string;
  }) {
    const { page = 1, pageSize = 20, userId, action, module, targetType } = params;
    const qb = this.auditLogRepository.createQueryBuilder('log');

    if (userId) {
      qb.andWhere('log.userId = :userId', { userId });
    }
    if (action) {
      qb.andWhere('log.action = :action', { action });
    }
    if (module) {
      qb.andWhere('log.module = :module', { module });
    }

    qb.orderBy('log.createdAt', 'DESC');

    const [list, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  // ========== 内容审核 ==========

  async createReview(data: {
    targetType: string;
    targetId: number;
    status: number;
    reason?: string;
    reviewerId?: number;
  }) {
    return this.reviewRepo.save(this.reviewRepo.create(data));
  }

  async getReview(targetType: string, targetId: number) {
    return this.reviewRepo.findOne({
      where: { targetType, targetId },
      order: { createdAt: 'DESC' },
      relations: ['reviewer'],
    });
  }

  async getPendingReviews(params: { page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 20 } = params;
    const [list, total] = await this.reviewRepo.findAndCount({
      where: { status: 0 },
      order: { createdAt: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['reviewer'],
    });
    return { list, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async updateReviewStatus(id: number, status: number, reason?: string) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('审核记录不存在');
    review.status = status;
    if (reason) review.reason = reason;
    return this.reviewRepo.save(review);
  }
}
