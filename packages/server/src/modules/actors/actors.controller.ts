import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ActorsService } from './actors.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { QueryActorDto } from './dto/query-actor.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('演员')
@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Post()
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: '创建演员' })
  async create(@Body() createActorDto: CreateActorDto) {
    return this.actorsService.create(createActorDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: '获取演员列表' })
  async findAll(@Query() queryDto: QueryActorDto) {
    return this.actorsService.findAll(queryDto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: '获取演员详情' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.actorsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: '更新演员' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActorDto: Partial<CreateActorDto>,
  ) {
    return this.actorsService.update(id, updateActorDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除演员' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.actorsService.remove(id);
  }
}
