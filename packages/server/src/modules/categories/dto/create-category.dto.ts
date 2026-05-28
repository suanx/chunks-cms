import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({ description: '分类名称' })
  @IsString()
  @IsNotEmpty({ message: '分类名称不能为空' })
  name: string;

  @ApiPropertyOptional({ description: 'URL别名' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: '父分类ID', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  parentId?: number;

  @ApiPropertyOptional({ description: '图标' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: '封面图URL' })
  @IsOptional()
  @IsString()
  coverUrl?: string;

  @ApiPropertyOptional({ description: '分类描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '类型 1=视频 2=影视', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  type?: number;

  @ApiPropertyOptional({ description: '排序', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ description: '是否显示 1=显示 0=隐藏', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  isVisible?: number;
}
