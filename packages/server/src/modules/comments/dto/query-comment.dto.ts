import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class QueryCommentDto extends PaginationDto {
  @ApiPropertyOptional({ description: '视频ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  videoId?: number;

  @ApiPropertyOptional({ description: '影视ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  movieId?: number;

  @ApiPropertyOptional({ description: '状态 1=正常 0=隐藏' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status?: number;
}
