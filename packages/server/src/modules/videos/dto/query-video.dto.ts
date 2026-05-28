import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class QueryVideoDto extends PaginationDto {
  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '分类ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({ description: '状态 0=禁用 1=启用' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status?: number;

  @ApiPropertyOptional({ description: '发布状态 0=草稿 1=已发布' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  publishStatus?: number;

  @ApiPropertyOptional({ description: '排序字段', enum: ['createdAt', 'viewCount', 'likeCount', 'sortOrder'] })
  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'viewCount', 'likeCount', 'sortOrder'])
  sortBy?: string;

  @ApiPropertyOptional({ description: '排序方向', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
