import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { WatchHistory } from './entities/watch-history.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(WatchHistory)
    private readonly watchHistoryRepo: Repository<WatchHistory>,
    private readonly auditService: AuditService,
  ) {}

  async create(createUserDto: CreateUserDto, userId?: number, ip?: string, userAgent?: string) {
    // 检查用户名唯一性
    const existing = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existing) {
      throw new ConflictException('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved as any;

    await this.auditService.log({
      userId,
      action: 'create',
      module: 'users',
      targetId: saved.id,
      detail: `创建用户: ${saved.username}`,
      ip,
      userAgent,
    });

    return result;
  }

  async createSocialUser(data: { username: string; email: string; avatar?: string; nickname?: string; password: string }) {
    const existing = await this.userRepository.findOne({
      where: [{ username: data.username }, { email: data.email }],
    });
    if (existing) {
      return existing;
    }

    const user = this.userRepository.create({
      ...data,
      status: 1,
    });

    return this.userRepository.save(user);
  }

  async findAll(queryDto: QueryUserDto) {
    const { page, pageSize, keyword, status } = queryDto;
    const qb = this.userRepository.createQueryBuilder('user');
    qb.leftJoinAndSelect('user.roles', 'role');

    if (keyword) {
      qb.where(
        '(user.username LIKE :keyword OR user.nickname LIKE :keyword OR user.email LIKE :keyword OR user.phone LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (status !== undefined && status !== null) {
      qb.andWhere('user.status = :status', { status });
    }

    qb.orderBy('user.id', 'DESC');

    const [list, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    // 移除密码字段
    const sanitized = list.map((u) => {
      const { password, ...rest } = u as any;
      return rest;
    });

    return { list: sanitized, total, page, pageSize };
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    const { password, ...result } = user as any;
    return result;
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async updateProfile(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    Object.assign(user, updateUserDto);
    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved as any;
    return result;
  }

  async updateStatus(id: number, status: number, operatorId?: number, ip?: string, userAgent?: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    user.status = status;
    await this.userRepository.save(user);

    await this.auditService.log({
      userId: operatorId,
      action: 'update_status',
      module: 'users',
      targetId: id,
      detail: `更新用户状态: ${user.username} -> ${status === 1 ? '启用' : '禁用'}`,
      ip,
      userAgent,
    });

    return { message: '状态更新成功' };
  }

  async getProfile(id: number) {
    return this.findById(id);
  }

  async count() {
    return this.userRepository.count();
  }

  // ========== 观看历史(续播) ==========

  async updateWatchProgress(userId: number, videoId: number, data: {
    currentPosition: number;
    duration: number;
    lastPlayUrl?: string;
  }): Promise<void> {
    const { currentPosition, duration, lastPlayUrl } = data;
    const progress = duration > 0 ? Math.min(100, (currentPosition / duration) * 100) : 0;

    const existing = await this.watchHistoryRepo.findOne({
      where: { userId, videoId },
    });

    if (existing) {
      existing.currentPosition = currentPosition;
      existing.duration = duration;
      existing.progress = parseFloat(progress.toFixed(2));
      if (lastPlayUrl) existing.lastPlayUrl = lastPlayUrl;
      existing.watchedAt = new Date();
      await this.watchHistoryRepo.save(existing);
    } else {
      await this.watchHistoryRepo.save(
        this.watchHistoryRepo.create({
          userId,
          videoId,
          currentPosition,
          duration,
          progress: parseFloat(progress.toFixed(2)),
          lastPlayUrl,
        }),
      );
    }
  }

  async getWatchHistoryWithResume(userId: number) {
    return this.watchHistoryRepo
      .createQueryBuilder('wh')
      .leftJoinAndSelect('wh.video', 'video')
      .where('wh.userId = :userId', { userId })
      .orderBy('wh.watchedAt', 'DESC')
      .limit(100)
      .getMany();
  }
}
