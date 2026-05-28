import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRatingDto {
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

  @ApiProperty({ description: '评分 1-10', example: 8 })
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: '评分最低为1' })
  @Max(10, { message: '评分最高为10' })
  score: number;
}
