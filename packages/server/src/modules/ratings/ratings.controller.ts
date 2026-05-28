import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('评分')
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '提交/更新评分' })
  async createOrUpdate(
    @CurrentUser('id') userId: number,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    return this.ratingsService.createOrUpdate(userId, createRatingDto);
  }

  @Get('average')
  @ApiOperation({ summary: '获取平均评分' })
  @ApiQuery({ name: 'type', enum: ['video', 'movie'] })
  @ApiQuery({ name: 'targetId', type: Number })
  async getAverage(
    @Query('type') type: 'video' | 'movie',
    @Query('targetId') targetId: number,
  ) {
    return this.ratingsService.getAverage(type, targetId);
  }

  @Get('distribution')
  @ApiOperation({ summary: '获取评分分布' })
  @ApiQuery({ name: 'type', enum: ['video', 'movie'] })
  @ApiQuery({ name: 'targetId', type: Number })
  async getDistribution(
    @Query('type') type: 'video' | 'movie',
    @Query('targetId') targetId: number,
  ) {
    return this.ratingsService.getDistribution(type, targetId);
  }
}
