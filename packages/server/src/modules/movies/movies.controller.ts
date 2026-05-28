import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('影视')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: '创建影视', description: '管理员创建新影视' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: '获取影视列表', description: '支持分页、关键词搜索、分类筛选' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码，默认1' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: '每页数量，默认20' })
  @ApiQuery({ name: 'keyword', required: false, type: String, description: '搜索关键词' })
  @ApiQuery({ name: 'categoryId', required: false, type: Number, description: '分类ID' })
  @ApiQuery({ name: 'type', required: false, type: Number, description: '类型' })
  @ApiQuery({ name: 'status', required: false, type: Number, description: '状态' })
  @ApiQuery({ name: 'region', required: false, type: String, description: '地区' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: '排序字段' })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, description: '排序方向 ASC/DESC' })
  @ApiResponse({ status: 200, description: '成功返回影视列表' })
  async findAll(@Query() queryDto: QueryMovieDto) {
    return this.moviesService.findAll(queryDto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: '获取影视详情', description: '根据ID获取影视详情，包含分类和剧集' })
  @ApiParam({ name: 'id', type: Number, description: '影视ID' })
  @ApiResponse({ status: 200, description: '成功返回影视详情' })
  @ApiResponse({ status: 404, description: '影视不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: '更新影视', description: '管理员更新影视信息' })
  @ApiParam({ name: 'id', type: Number, description: '影视ID' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '影视不存在' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除影视', description: '管理员删除影视' })
  @ApiParam({ name: 'id', type: Number, description: '影视ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '影视不存在' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }

  @Post(':id/episodes')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: '添加剧集', description: '为影视添加新剧集' })
  @ApiParam({ name: 'id', type: Number, description: '影视ID' })
  @ApiResponse({ status: 201, description: '剧集添加成功' })
  @ApiResponse({ status: 404, description: '影视不存在' })
  async addEpisode(
    @Param('id', ParseIntPipe) id: number,
    @Body() episodeData: any,
  ) {
    return this.moviesService.addEpisode(id, episodeData);
  }

  @Patch('episodes/:episodeId')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: '更新剧集', description: '更新指定剧集信息' })
  @ApiParam({ name: 'episodeId', type: Number, description: '剧集ID' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '剧集不存在' })
  async updateEpisode(
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Body() episodeData: any,
  ) {
    return this.moviesService.updateEpisode(episodeId, episodeData);
  }

  @Delete('episodes/:episodeId')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除剧集', description: '删除指定剧集' })
  @ApiParam({ name: 'episodeId', type: Number, description: '剧集ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '剧集不存在' })
  async removeEpisode(@Param('episodeId', ParseIntPipe) episodeId: number) {
    return this.moviesService.removeEpisode(episodeId);
  }

  // ========== 批量操作 ==========

  @Patch('batch/status')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '批量更新影视状态' })
  async batchUpdateStatus(@Body() body: { ids: number[]; status: number }) {
    return this.moviesService.batchUpdateStatus(body.ids, body.status);
  }

  @Delete('batch')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '批量删除影视' })
  async batchDelete(@Body() body: { ids: number[] }) {
    return this.moviesService.batchDelete(body.ids);
  }
}

