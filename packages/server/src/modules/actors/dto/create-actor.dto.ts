import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateActorDto {
  @ApiProperty({ description: '演员姓名' })
  @IsString()
  @IsNotEmpty({ message: '演员姓名不能为空' })
  name: string;

  @ApiPropertyOptional({ description: '英文名' })
  @IsOptional()
  @IsString()
  englishName?: string;

  @ApiPropertyOptional({ description: '头像URL' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: '出生日期' })
  @IsOptional()
  birthDate?: string;

  @ApiPropertyOptional({ description: '出生地' })
  @IsOptional()
  @IsString()
  birthPlace?: string;

  @ApiPropertyOptional({ description: '身高（cm）' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({ description: '个人简介' })
  @IsOptional()
  @IsString()
  biography?: string;
}
