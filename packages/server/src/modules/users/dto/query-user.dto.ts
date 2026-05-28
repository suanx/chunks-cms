import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class QueryUserDto extends PaginationDto {
  @ApiPropertyOptional({ description: '搜索关键词（用户名/昵称/邮箱/手机号）' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '状态筛选 1=启用 0=禁用' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status?: number;
}
