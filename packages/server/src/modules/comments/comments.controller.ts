import { Controller, Get, Post, Delete, Body, Param, Query, ParseIntPipe, HttpCode, HttpStatus, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';

@ApiTags('评论')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '发表评论' })
  @UseGuards(RateLimitGuard)
  @SetMetadata('limit', 10)
  @SetMetadata('windowMs', 60000)
  @SetMetadata('rateLimitKeyPrefix', 'rl:comment:create:')
  async create(
    @CurrentUser('id') userId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(userId, createCommentDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: '获取评论列表' })
  async findAll(@Query() queryDto: QueryCommentDto) {
    return this.commentsService.findAll(queryDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除评论' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @CurrentUser('roles') roles: string[],
  ) {
    return this.commentsService.remove(id, userId, roles);
  }
}
