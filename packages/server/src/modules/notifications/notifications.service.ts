import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notiRepo: Repository<Notification>,
  ) {}

  async create(data: {
    userId: number;
    type: string;
    title: string;
    content?: string;
    relatedType?: string;
    relatedId?: number;
  }) {
    return this.notiRepo.save(this.notiRepo.create(data));
  }

  async findAll(userId: number, params: { page?: number; pageSize?: number; isRead?: boolean } = {}) {
    const { page = 1, pageSize = 20, isRead } = params;
    const where: any = { userId };
    if (isRead !== undefined) where.isRead = isRead;

    const [list, total] = await this.notiRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const unreadCount = await this.notiRepo.count({ where: { userId, isRead: false } });

    return { list, total, unreadCount, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async markAsRead(id: number, userId: number) {
    await this.notiRepo.update({ id, userId }, { isRead: true });
  }

  async markAllAsRead(userId: number) {
    await this.notiRepo.update({ userId, isRead: false }, { isRead: true });
  }

  async delete(id: number, userId: number) {
    await this.notiRepo.delete({ id, userId });
  }

  async getUnreadCount(userId: number) {
    return this.notiRepo.count({ where: { userId, isRead: false } });
  }
}
