import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actor } from './entities/actor.entity';
import { CreateActorDto } from './dto/create-actor.dto';
import { QueryActorDto } from './dto/query-actor.dto';

@Injectable()
export class ActorsService {
  constructor(
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
  ) {}

  async create(createActorDto: CreateActorDto) {
    const actor = this.actorRepository.create(createActorDto);
    return this.actorRepository.save(actor);
  }

  async findAll(queryDto: QueryActorDto) {
    const { page, pageSize, keyword } = queryDto;
    const qb = this.actorRepository.createQueryBuilder('actor');

    if (keyword) {
      qb.where('actor.name LIKE :keyword OR actor.englishName LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    qb.orderBy('actor.id', 'DESC');

    const [list, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total, page, pageSize };
  }

  async findOne(id: number) {
    const actor = await this.actorRepository.findOne({ where: { id } });
    if (!actor) {
      throw new NotFoundException('演员不存在');
    }
    return actor;
  }

  async update(id: number, updateActorDto: Partial<CreateActorDto>) {
    const actor = await this.findOne(id);
    Object.assign(actor, updateActorDto);
    return this.actorRepository.save(actor);
  }

  async remove(id: number) {
    const actor = await this.findOne(id);
    await this.actorRepository.remove(actor);
    return { message: '删除成功' };
  }
}
