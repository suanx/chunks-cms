import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MinLength, IsEmail, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: '用户名', example: 'testuser' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(3, { message: '用户名至少3个字符' })
  username: string;

  @ApiProperty({ description: '密码（至少8位，包含大小写字母和数字）', example: 'MyPass123' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(8, { message: '密码至少8位' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: '密码需包含大小写字母和数字' })
  password: string;

  @ApiPropertyOptional({ description: '邮箱', example: 'test@example.com' })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @ApiPropertyOptional({ description: '手机号', example: '13800138000' })
  @IsOptional()
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone?: string;

  @ApiPropertyOptional({ description: '昵称', example: '测试用户' })
  @IsOptional()
  @IsString()
  nickname?: string;
}
