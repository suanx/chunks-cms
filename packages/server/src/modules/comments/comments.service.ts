import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
import { sanitizeHtml } from '../../common/utils/sanitize';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(userId: number, createCommentDto: CreateCommentDto) {
    // XSS 防护：对评论内容进行过滤
    const sanitizedContent = sanitizeHtml(createCommentDto.content);
    const comment = this.commentRepository.create({
      ...createCommentDto,
      content: sanitizedContent,
      userId,
    });
    return this.commentRepository.save(comment);
  }

  async findAll(queryDto: QueryCommentDto) {
    const { page, pageSize, videoId, movieId, status } = queryDto;
    const qb = this.commentRepository.createQueryBuilder('comment');
    qb.leftJoinAndSelect('comment.user', 'user');

    // Only show top-level comments
    qb.where('comment.parentId = 0');

    if (videoId) {
      qb.andWhere('comment.videoId = :videoId', { videoId });
    }

    if (movieId) {
      qb.andWhere('comment.movieId = :movieId', { movieId });
    }

    if (status !== undefined && status !== null) {
      qb.andWhere('comment.status = :status', { status });
    }

    qb.orderBy('comment.createdAt', 'DESC');

    const [list, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    // Load replies for each comment
    const commentsWithReplies = await Promise.all(
      list.map(async (comment) => {
        const replies = await this.commentRepository.find({
          where: { parentId: comment.id },
          relations: ['user'],
          order: { createdAt: 'ASC' },
          take: 5,
        });
        return { ...comment, replies };
      }),
    );

    return { list: commentsWithReplies, total, page, pageSize };
  }

  async remove(id: number, userId: number, userRoles: string[]) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    // Only the author or admin can delete
    if (comment.userId !== userId && !userRoles.includes('admin') && !userRoles.includes('super_admin')) {
      throw new ForbiddenException('没有权限删除此评论');
    }

    await this.commentRepository.remove(comment);
    return { message: '删除成功' };
  }

  async count() {
    return this.commentRepository.count();
  }
}
