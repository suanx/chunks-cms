import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVideoDto {
  @ApiProperty({ description: '视频标题' })
  @IsString()
  @IsNotEmpty({ message: '视频标题不能为空' })
  title: string;

  @ApiPropertyOptional({ description: 'URL别名' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: '视频描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '封面图URL' })
  @IsOptional()
  @IsString()
  coverUrl?: string;

  @ApiProperty({ description: '视频URL' })
  @IsString()
  @IsNotEmpty({ message: '视频URL不能为空' })
  videoUrl: string;

  @ApiPropertyOptional({ description: '视频存储Key' })
  @IsOptional()
  @IsString()
  videoKey?: string;

  @ApiPropertyOptional({ description: '时长（秒）', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({ description: '文件大小（字节）', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  fileSize?: number;

  @ApiPropertyOptional({ description: '分辨率', example: '1080p' })
  @IsOptional()
  @IsString()
  resolution?: string;

  @ApiPropertyOptional({ description: '状态 0=禁用 1=启用', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status?: number;

  @ApiPropertyOptional({ description: '发布状态 0=草稿 1=已发布', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  publishStatus?: number;

  @ApiPropertyOptional({ description: '排序', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ description: '来源' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ description: '来源URL' })
  @IsOptional()
  @IsString()
  sourceUrl?: string;

  @ApiPropertyOptional({ description: '分类ID数组', type: [Number] })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  categoryIds?: number[];
}
