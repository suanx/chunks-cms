import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto, UpdateTagDto } from './dto/create-tag.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    // Check uniqueness
    const existing = await this.tagRepository.findOne({
      where: { name: createTagDto.name },
    });
    if (existing) {
      throw new ConflictException('标签名已存在');
    }

    const tag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(tag);
  }

  async findAll(queryDto?: PaginationDto & { keyword?: string }) {
    const page = queryDto?.page || 1;
    const pageSize = queryDto?.pageSize || 50;
    const keyword = queryDto?.keyword;

    const qb = this.tagRepository.createQueryBuilder('tag');

    if (keyword) {
      qb.where('tag.name LIKE :keyword', { keyword: `%${keyword}%` });
    }

    qb.orderBy('tag.usageCount', 'DESC');
    qb.addOrderBy('tag.id', 'DESC');

    const [list, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total, page, pageSize };
  }

  async findOne(id: number) {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException('标签不存在');
    }
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id);
    Object.assign(tag, updateTagDto);
    return this.tagRepository.save(tag);
  }

  async remove(id: number) {
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
    return { message: '删除成功' };
  }
}
