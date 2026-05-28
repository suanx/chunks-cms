import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { VideoEncoding } from './entities/video-encoding.entity';
import { Category } from '../categories/entities/category.entity';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { RedisModule } from '../../redis/redis.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Video, VideoEncoding, Category]), RedisModule, AuditModule],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
