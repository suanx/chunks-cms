import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('轮播图')
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Post()
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: '创建轮播图' })
  async create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannersService.create(createBannerDto);
  }

  @Get()
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: '获取所有轮播图（管理）' })
  async findAll() {
    return this.bannersService.findAll();
  }

  @Get('active')
  @Public()
  @ApiOperation({ summary: '获取激活的轮播图' })
  async findActive(@Query('position') position?: string) {
    return this.bannersService.findActive(position);
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: '获取轮播图详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bannersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: '更新轮播图' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBannerDto: Partial<CreateBannerDto>,
  ) {
    return this.bannersService.update(id, updateBannerDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除轮播图' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.bannersService.remove(id);
  }
}
