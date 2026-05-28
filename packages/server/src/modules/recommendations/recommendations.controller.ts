import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('推荐')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('home')
  @Public()
  @ApiOperation({ summary: '首页推荐' })
  async getHomeRecommendations() {
    return this.recommendationsService.getHomeRecommendations();
  }

  @Get('personalized')
  @ApiOperation({ summary: '个性化推荐' })
  async getPersonalized(@CurrentUser('id') userId: number) {
    return this.recommendationsService.getPersonalized(userId);
  }

  @Get('trending')
  @Public()
  @ApiOperation({ summary: '热门趋势' })
  async getTrending() {
    return this.recommendationsService.getTrending();
  }

  @Get()
  @Public()
  @ApiOperation({ summary: '推荐列表' })
  async findAll(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('type') type?: string) {
    return this.recommendationsService.findAll({ page, pageSize, type });
  }
}
