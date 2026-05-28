import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('收藏')
@ApiBearerAuth()
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('toggle')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '切换收藏状态' })
  @ApiQuery({ name: 'type', enum: ['video', 'movie'] })
  @ApiQuery({ name: 'targetId', type: Number })
  async toggle(
    @CurrentUser('id') userId: number,
    @Query('type') type: 'video' | 'movie',
    @Query('targetId') targetId: number,
  ) {
    return this.favoritesService.toggle(userId, type, targetId);
  }

  @Post('toggle/:videoId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '切换视频收藏状态' })
  async toggleFavorite(
    @CurrentUser('id') userId: number,
    @Param('videoId') videoId: number,
  ) {
    return this.favoritesService.toggleFavorite(userId, videoId);
  }

  @Get('check')
  @ApiOperation({ summary: '检查是否已收藏' })
  @ApiQuery({ name: 'type', enum: ['video', 'movie'] })
  @ApiQuery({ name: 'targetId', type: Number })
  async check(
    @CurrentUser('id') userId: number,
    @Query('type') type: 'video' | 'movie',
    @Query('targetId') targetId: number,
  ) {
    return this.favoritesService.check(userId, type, targetId);
  }

  @Get('list')
  @ApiOperation({ summary: '获取收藏列表' })
  @ApiQuery({ name: 'type', enum: ['video', 'movie'], required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  async list(
    @CurrentUser('id') userId: number,
    @Query('type') type?: 'video' | 'movie',
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.favoritesService.findAll(userId, type, page || 1, pageSize || 20);
  }

  @Get()
  @ApiOperation({ summary: '获取收藏列表(含视频)' })
  async getFavorites(@CurrentUser('id') userId: number) {
    return this.favoritesService.getFavorites(userId);
  }

  // ========== 收藏夹分组 ==========

  @Post('folders')
  @ApiOperation({ summary: '创建收藏夹' })
  async createFolder(
    @CurrentUser('id') userId: number,
    @Body() body: { name: string; description?: string },
  ) {
    return this.favoritesService.createFolder(userId, body.name, body.description);
  }

  @Get('folders')
  @ApiOperation({ summary: '获取收藏夹列表' })
  async getFolders(@CurrentUser('id') userId: number) {
    return this.favoritesService.getFolders(userId);
  }

  @Patch('folders/:id')
  @ApiOperation({ summary: '更新收藏夹' })
  async updateFolder(
    @CurrentUser('id') userId: number,
    @Param('id') id: number,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.favoritesService.updateFolder(id, userId, body);
  }

  @Delete('folders/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除收藏夹' })
  async deleteFolder(@CurrentUser('id') userId: number, @Param('id') id: number) {
    await this.favoritesService.deleteFolder(id, userId);
    return { message: '删除成功' };
  }

  @Post('folders/:id/items/:videoId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '添加到收藏夹' })
  async addToFolder(
    @CurrentUser('id') userId: number,
    @Param('id') folderId: number,
    @Param('videoId') videoId: number,
  ) {
    return this.favoritesService.addToFolder(folderId, videoId, userId);
  }

  @Delete('folders/:id/items/:videoId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '从收藏夹移除' })
  async removeFromFolder(
    @CurrentUser('id') userId: number,
    @Param('id') folderId: number,
    @Param('videoId') videoId: number,
  ) {
    await this.favoritesService.removeFromFolder(folderId, videoId, userId);
    return { message: '移除成功' };
  }

  @Get('folders/:id/items')
  @ApiOperation({ summary: '获取收藏夹内容' })
  async getFolderItems(
    @CurrentUser('id') userId: number,
    @Param('id') folderId: number,
  ) {
    return this.favoritesService.getFolderItems(folderId, userId);
  }
}
