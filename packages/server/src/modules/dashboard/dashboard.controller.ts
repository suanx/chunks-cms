import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('仪表盘')
@ApiBearerAuth()
@Controller('dashboard')
@Roles('admin', 'super_admin')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: '获取统计概览' })
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('trends')
  @ApiOperation({ summary: '获取近7天趋势数据' })
  @ApiQuery({ name: 'days', type: Number, required: false })
  async getTrends(@Query('days') days?: number) {
    return this.dashboardService.getTrends(days || 7);
  }

  @Get('latest-videos')
  @ApiOperation({ summary: '获取最新视频' })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getLatestVideos(@Query('limit') limit?: number) {
    return this.dashboardService.getLatestVideos(limit || 10);
  }

  @Get('latest-users')
  @ApiOperation({ summary: '获取最新用户' })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getLatestUsers(@Query('limit') limit?: number) {
    return this.dashboardService.getLatestUsers(limit || 10);
  }
}
