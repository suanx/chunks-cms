import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @ApiProperty({ description: '评论内容' })
  @IsString()
  @IsNotEmpty({ message: '评论内容不能为空' })
  content: string;

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

  @ApiPropertyOptional({ description: '父评论ID（回复某条评论）', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  parentId?: number;

  @ApiPropertyOptional({ description: '回复用户ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  replyToUserId?: number;
}
