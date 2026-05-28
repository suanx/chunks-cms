import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('搜索')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: '搜索视频和影视' })
  @ApiQuery({ name: 'keyword', type: String })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  async search(
    @Query('keyword') keyword: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.searchService.search(keyword, page || 1, pageSize || 20);
  }

  @Get('suggest')
  @Public()
  @ApiOperation({ summary: '搜索建议' })
  @ApiQuery({ name: 'keyword', type: String })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async suggest(
    @Query('keyword') keyword: string,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.suggest(keyword, limit || 10);
  }
}
