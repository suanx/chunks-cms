import { Controller, Get, Patch, Delete, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('通知')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notiService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: '获取通知列表' })
  async findAll(
    @CurrentUser('id') userId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('isRead') isRead?: string,
  ) {
    const isReadBool = isRead === 'true' ? true : isRead === 'false' ? false : undefined;
    return this.notiService.findAll(userId, { page, pageSize, isRead: isReadBool });
  }

  @Get('unread-count')
  @ApiOperation({ summary: '获取未读数量' })
  async getUnreadCount(@CurrentUser('id') userId: number) {
    const count = await this.notiService.getUnreadCount(userId);
    return { count };
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '标记已读' })
  async markAsRead(@CurrentUser('id') userId: number, @Param('id') id: number) {
    await this.notiService.markAsRead(id, userId);
    return { message: '已标记为已读' };
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '全部已读' })
  async markAllAsRead(@CurrentUser('id') userId: number) {
    await this.notiService.markAllAsRead(userId);
    return { message: '已全部标记为已读' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除通知' })
  async delete(@CurrentUser('id') userId: number, @Param('id') id: number) {
    await this.notiService.delete(id, userId);
    return { message: '删除成功' };
  }
}
