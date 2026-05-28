import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBannerDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;

  @ApiProperty({ description: '图片URL' })
  @IsString()
  @IsNotEmpty({ message: '图片URL不能为空' })
  imageUrl: string;

  @ApiPropertyOptional({ description: '链接URL' })
  @IsOptional()
  @IsString()
  linkUrl?: string;

  @ApiPropertyOptional({ description: '链接类型 1=内部 2=外部', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  linkType?: number;

  @ApiPropertyOptional({ description: '跳转目标类型', example: 'movie' })
  @IsOptional()
  @IsString()
  targetType?: string;

  @ApiPropertyOptional({ description: '跳转目标ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  targetId?: number;

  @ApiPropertyOptional({ description: '展示位置', default: 'home' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ description: '排序', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ description: '是否启用 1=启用 0=禁用', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  isActive?: number;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  startTime?: Date;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  endTime?: Date;
}
