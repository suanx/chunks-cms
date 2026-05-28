import { Controller, Get, Patch, Body, Param, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('用户')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: '获取当前用户信息', description: '获取当前已登录用户的个人信息' })
  @ApiResponse({ status: 200, description: '成功返回用户信息' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getProfile(@CurrentUser('id') userId: number) {
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: '更新当前用户信息', description: '用户更新自己的个人信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async updateProfile(
    @CurrentUser('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(userId, updateUserDto);
  }

  @Get()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: '获取用户列表（管理员）', description: '管理员获取所有用户列表，支持搜索和分页' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码，默认1' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: '每页数量，默认20' })
  @ApiQuery({ name: 'keyword', required: false, type: String, description: '搜索关键词（用户名/昵称/邮箱/手机号）' })
  @ApiQuery({ name: 'status', required: false, type: Number, description: '状态：0-禁用 1-启用' })
  @ApiResponse({ status: 200, description: '成功返回用户列表' })
  @ApiResponse({ status: 403, description: '权限不足' })
  async findAll(@Query() queryDto: QueryUserDto) {
    return this.usersService.findAll(queryDto);
  }

  @Get(':id')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: '获取用户详情（管理员）', description: '管理员根据ID获取用户详情' })
  @ApiParam({ name: 'id', type: Number, description: '用户ID' })
  @ApiResponse({ status: 200, description: '成功返回用户详情' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Patch(':id/status')
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '更新用户状态（管理员）', description: '管理员启用或禁用用户' })
  @ApiParam({ name: 'id', type: Number, description: '用户ID' })
  @ApiQuery({ name: 'status', required: true, type: Number, description: '状态：0-禁用 1-启用' })
  @ApiResponse({ status: 200, description: '状态更新成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: number,
  ) {
    return this.usersService.updateStatus(id, status);
  }

  // ========== 观看历史(续播) ==========

  @Patch('watch-progress/:videoId')
  @ApiOperation({ summary: '更新播放进度(续播)', description: '更新用户视频播放进度' })
  @ApiParam({ name: 'videoId', type: Number, description: '视频ID' })
  @ApiResponse({ status: 200, description: '进度更新成功' })
  async updateWatchProgress(
    @CurrentUser('id') userId: number,
    @Param('videoId') videoId: number,
    @Body() body: { currentPosition: number; duration: number; lastPlayUrl?: string },
  ) {
    return this.usersService.updateWatchProgress(userId, videoId, body);
  }

  @Get('watch-history/resume')
  @ApiOperation({ summary: '获取带续播信息的观看历史', description: '获取用户的观看历史，支持续播' })
  @ApiResponse({ status: 200, description: '成功返回观看历史列表' })
  async getWatchHistoryResume(@CurrentUser('id') userId: number) {
    return this.usersService.getWatchHistoryWithResume(userId);
  }
}
