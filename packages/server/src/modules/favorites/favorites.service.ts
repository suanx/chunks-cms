import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { CollectionFolder } from './entities/collection-folder.entity';
import { CollectionItem } from './entities/collection-item.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(CollectionFolder)
    private readonly folderRepo: Repository<CollectionFolder>,
    @InjectRepository(CollectionItem)
    private readonly itemRepo: Repository<CollectionItem>,
  ) {}

  async toggle(userId: number, type: 'video' | 'movie', targetId: number) {
    const where: any = { userId };
    if (type === 'video') {
      where.videoId = targetId;
    } else {
      where.movieId = targetId;
    }

    const existing = await this.favoriteRepository.findOne({ where });

    if (existing) {
      await this.favoriteRepository.remove(existing);
      return { isFavorited: false, message: '取消收藏成功' };
    }

    const favorite = this.favoriteRepository.create(where);
    await this.favoriteRepository.save(favorite);
    return { isFavorited: true, message: '收藏成功' };
  }

  async toggleFavorite(userId: number, videoId: number) {
    const existing = await this.favoriteRepository.findOne({ where: { userId, videoId } });
    if (existing) {
      await this.favoriteRepository.remove(existing);
      return { favorited: false };
    }
    await this.favoriteRepository.save(this.favoriteRepository.create({ userId, videoId }));
    return { favorited: true };
  }

  async check(userId: number, type: 'video' | 'movie', targetId: number) {
    const where: any = { userId };
    if (type === 'video') {
      where.videoId = targetId;
    } else {
      where.movieId = targetId;
    }

    const favorite = await this.favoriteRepository.findOne({ where });
    return { isFavorited: !!favorite };
  }

  async findAll(userId: number, type?: 'video' | 'movie', page = 1, pageSize = 20) {
    const qb = this.favoriteRepository.createQueryBuilder('favorite');
    qb.where('favorite.userId = :userId', { userId });

    if (type === 'video') {
      qb.andWhere('favorite.videoId IS NOT NULL');
    } else if (type === 'movie') {
      qb.andWhere('favorite.movieId IS NOT NULL');
    }

    qb.orderBy('favorite.createdAt', 'DESC');

    const [list, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total, page, pageSize };
  }

  async getFavorites(userId: number, page = 1, pageSize = 20) {
    const [list, total] = await this.favoriteRepository.findAndCount({
      where: { userId },
      relations: ['video'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  // ========== 收藏夹分组 ==========

  async createFolder(userId: number, name: string, description?: string) {
    const maxOrder = await this.folderRepo
      .createQueryBuilder('f')
      .where('f.userId = :userId', { userId })
      .select('MAX(f.sortOrder)', 'max')
      .getRawOne();
    return this.folderRepo.save(
      this.folderRepo.create({
        userId,
        name,
        description,
        sortOrder: (maxOrder?.max || 0) + 1,
      }),
    );
  }

  async getFolders(userId: number) {
    return this.folderRepo.find({ where: { userId }, order: { sortOrder: 'ASC' } });
  }

  async updateFolder(id: number, userId: number, data: { name?: string; description?: string }) {
    const folder = await this.folderRepo.findOne({ where: { id, userId } });
    if (!folder) throw new NotFoundException('收藏夹不存在');
    Object.assign(folder, data);
    return this.folderRepo.save(folder);
  }

  async deleteFolder(id: number, userId: number) {
    const folder = await this.folderRepo.findOne({ where: { id, userId } });
    if (!folder) throw new NotFoundException('收藏夹不存在');
    await this.folderRepo.remove(folder);
  }

  async addToFolder(folderId: number, videoId: number, userId: number) {
    const folder = await this.folderRepo.findOne({ where: { id: folderId, userId } });
    if (!folder) throw new NotFoundException('收藏夹不存在');
    const exists = await this.itemRepo.findOne({ where: { folderId, videoId } });
    if (exists) return exists;
    return this.itemRepo.save(this.itemRepo.create({ folderId, videoId }));
  }

  async removeFromFolder(folderId: number, videoId: number, userId: number) {
    const folder = await this.folderRepo.findOne({ where: { id: folderId, userId } });
    if (!folder) throw new NotFoundException('收藏夹不存在');
    await this.itemRepo.delete({ folderId, videoId });
  }

  async getFolderItems(folderId: number, userId: number) {
    const folder = await this.folderRepo.findOne({ where: { id: folderId, userId } });
    if (!folder) throw new NotFoundException('收藏夹不存在');
    return this.itemRepo.find({
      where: { folderId },
      relations: ['video'],
      order: { createdAt: 'DESC' },
    });
  }
}
