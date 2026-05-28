import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, IsEmail, Matches, IsNumber } from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional({ description: '用户名' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiPropertyOptional({ description: '密码' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: '手机号' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({ description: '头像URL' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: '个人简介' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: '状态 1=启用 0=禁用' })
  @IsOptional()
  @IsNumber()
  status?: number;
}
