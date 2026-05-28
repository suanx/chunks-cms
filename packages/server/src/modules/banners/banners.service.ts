import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async create(createBannerDto: CreateBannerDto) {
    const banner = this.bannerRepository.create(createBannerDto);
    return this.bannerRepository.save(banner);
  }

  async findAll() {
    return this.bannerRepository.find({
      order: { sortOrder: 'ASC', id: 'DESC' },
    });
  }

  async findActive(position?: string) {
    const qb = this.bannerRepository.createQueryBuilder('banner');
    qb.where('banner.isActive = 1');

    if (position) {
      qb.andWhere('banner.position = :position', { position });
    }

    qb.andWhere('(banner.startTime IS NULL OR banner.startTime <= :now)', { now: new Date() });
    qb.andWhere('(banner.endTime IS NULL OR banner.endTime >= :now)', { now: new Date() });

    qb.orderBy('banner.sortOrder', 'ASC');

    return qb.getMany();
  }

  async findOne(id: number) {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException('轮播图不存在');
    }
    return banner;
  }

  async update(id: number, updateBannerDto: Partial<CreateBannerDto>) {
    const banner = await this.findOne(id);
    Object.assign(banner, updateBannerDto);
    return this.bannerRepository.save(banner);
  }

  async remove(id: number) {
    const banner = await this.findOne(id);
    await this.bannerRepository.remove(banner);
    return { message: '删除成功' };
  }
}
