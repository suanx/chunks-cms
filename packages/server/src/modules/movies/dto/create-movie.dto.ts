import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty({ description: '影视标题' })
  @IsString()
  @IsNotEmpty({ message: '影视标题不能为空' })
  title: string;

  @ApiPropertyOptional({ description: 'URL别名' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: '原始标题' })
  @IsOptional()
  @IsString()
  originalTitle?: string;

  @ApiPropertyOptional({ description: '简介描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '封面图URL' })
  @IsOptional()
  @IsString()
  coverUrl?: string;

  @ApiPropertyOptional({ description: '背景图URL' })
  @IsOptional()
  @IsString()
  backdropUrl?: string;

  @ApiPropertyOptional({ description: '预告片URL' })
  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @ApiPropertyOptional({ description: '类型 1=电影 2=剧集 3=综艺 4=动漫', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  type?: number;

  @ApiPropertyOptional({ description: '题材类型（逗号分隔）', example: '动作,科幻' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({ description: '地区', example: '中国大陆' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ description: '语言' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ description: '上映年份' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  releaseYear?: number;

  @ApiPropertyOptional({ description: '上映日期' })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @ApiPropertyOptional({ description: '总集数', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalEpisodes?: number;

  @ApiPropertyOptional({ description: '状态 0=下架 1=上架', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status?: number;

  @ApiPropertyOptional({ description: '是否完结 0=连载 1=完结', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  isEnded?: number;

  @ApiPropertyOptional({ description: '排序', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ description: '导演' })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiPropertyOptional({ description: '演员描述' })
  @IsOptional()
  @IsString()
  actorsDesc?: string;

  @ApiPropertyOptional({ description: '分类ID数组', type: [Number] })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  categoryIds?: number[];
}
