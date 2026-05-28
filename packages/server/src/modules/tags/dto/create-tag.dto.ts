import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: '标签名称' })
  @IsString()
  @IsNotEmpty({ message: '标签名称不能为空' })
  name: string;

  @ApiPropertyOptional({ description: 'URL别名' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: '颜色', default: '#409EFF' })
  @IsOptional()
  @IsString()
  color?: string;
}

export class UpdateTagDto {
  @ApiPropertyOptional({ description: '标签名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'URL别名' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: '颜色' })
  @IsOptional()
  @IsString()
  color?: string;
}
