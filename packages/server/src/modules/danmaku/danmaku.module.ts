import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Danmaku } from './entities/danmaku.entity';
import { DanmakuService } from './danmaku.service';
import { DanmakuController } from './danmaku.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Danmaku])],
  providers: [DanmakuService],
  controllers: [DanmakuController],
  exports: [DanmakuService],
})
export class DanmakuModule {}
