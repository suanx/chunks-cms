import { Controller, Get, Post, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DanmakuService } from './danmaku.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('弹幕')
@Controller('danmakus')
export class DanmakuController {
  constructor(private readonly danmakuService: DanmakuService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '发送弹幕' })
  async create(
    @CurrentUser('id') userId: number,
    @Body() body: { videoId: number; content: string; timePoint: number; mode?: string; color?: string; fontSize?: string },
  ) {
    return this.danmakuService.create({ ...body, userId });
  }

  @Get('video/:videoId')
  @Public()
  @ApiOperation({ summary: '获取视频弹幕' })
  async findByVideo(
    @Param('videoId') videoId: number,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.danmakuService.findByVideo(
      videoId,
      start ? parseInt(start) : undefined,
      end ? parseInt(end) : undefined,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除弹幕' })
  async delete(@Param('id') id: number) {
    await this.danmakuService.delete(id);
    return { message: '删除成功' };
  }
}
