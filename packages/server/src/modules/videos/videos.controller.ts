import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, HttpCode, HttpStatus, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { QueryVideoDto } from './dto/query-video.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { exportToExcel } from '../../common/utils/export';

@ApiTags('视频')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: '创建视频', description: '管理员创建新视频' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async create(@Body() createVideoDto: CreateVideoDto, @CurrentUser('id') userId: number, @Req() req: any) {
    return this.videosService.create(createVideoDto, userId, req.ip, req.headers['user-agent']);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: '获取视频列表', description: '支持分页、关键词搜索、分类筛选' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码，默认1' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: '每页数量，默认20' })
  @ApiQuery({ name: 'keyword', required: false, type: String, description: '搜索关键词' })
  @ApiQuery({ name: 'categoryId', required: false, type: Number, description: '分类ID' })
  @ApiQuery({ name: 'status', required: false, type: Number, description: '状态：0-禁用 1-启用' })
  @ApiQuery({ name: 'publishStatus', required: false, type: Number, description: '发布状态' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: '排序字段' })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, description: '排序方向 ASC/DESC' })
  @ApiResponse({ status: 200, description: '成功返回视频列表' })
  async findAll(@Query() queryDto: QueryVideoDto) {
    return this.videosService.findAll(queryDto);
  }

  // ========== 批量操作（固定路径在参数路由之前）==========

  @Patch('batch/status')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '批量更新视频状态' })
  async batchUpdateStatus(@Body() body: { ids: number[]; status: number }) {
    return this.videosService.batchUpdateStatus(body.ids, body.status);
  }

  @Delete('batch')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '批量删除视频' })
  async batchDelete(@Body() body: { ids: number[] }) {
    return this.videosService.batchDelete(body.ids);
  }

  // ========== 数据导出 ==========

  @Get('export')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: '导出视频数据' })
  async exportData(@Query() query: any, @Res() res: Response) {
    const data = await this.videosService.findAll({ ...query, pageSize: 10000 });
    const columns = [
      { header: 'ID', key: 'id' },
      { header: '标题', key: 'title' },
      { header: '播放量', key: 'viewCount' },
      { header: '状态', key: 'status' },
      { header: '创建时间', key: 'createdAt' },
    ];
    const buffer = exportToExcel(data.list, columns, 'videos');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=videos.xlsx');
    res.send(buffer);
  }

  // ========== 参数路由 ==========

  @Get(':id')
  @Public()
  @ApiOperation({ summary: '获取视频详情', description: '根据ID获取视频详情，包含分类信息' })
  @ApiParam({ name: 'id', type: Number, description: '视频ID' })
  @ApiResponse({ status: 200, description: '成功返回视频详情' })
  @ApiResponse({ status: 404, description: '视频不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: '更新视频', description: '管理员更新视频信息' })
  @ApiParam({ name: 'id', type: Number, description: '视频ID' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '视频不存在' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVideoDto: UpdateVideoDto,
    @CurrentUser('id') userId: number,
    @Req() req: any,
  ) {
    return this.videosService.update(id, updateVideoDto, userId, req.ip, req.headers['user-agent']);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除视频', description: '管理员删除视频' })
  @ApiParam({ name: 'id', type: Number, description: '视频ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '视频不存在' })
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser('id') userId: number, @Req() req: any) {
    return this.videosService.remove(id, userId, req.ip, req.headers['user-agent']);
  }

  @Post(':id/view')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '增加视频观看次数', description: '播放视频时调用，使用Redis缓存计数' })
  @ApiParam({ name: 'id', type: Number, description: '视频ID' })
  @ApiResponse({ status: 200, description: '观看次数已增加' })
  async incrementViewCount(@Param('id', ParseIntPipe) id: number) {
    await this.videosService.incrementViewCount(id);
    return { message: 'ok' };
  }
}

