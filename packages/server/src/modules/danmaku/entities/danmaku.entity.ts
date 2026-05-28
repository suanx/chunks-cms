import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Video } from '../../videos/entities/video.entity';

@Entity('danmakus')
@Index('idx_danmaku_video_time', ['videoId', 'timePoint'])
export class Danmaku {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  videoId: number;

  @ManyToOne(() => Video)
  @JoinColumn({ name: 'video_id' })
  video: Video;

  @Column({ type: 'int', unsigned: true, nullable: true })
  userId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  timePoint: number; // 视频播放时间点(毫秒)

  @Column({ type: 'varchar', length: 20, default: 'scroll' })
  mode: string; // scroll, top, bottom

  @Column({ type: 'varchar', length: 10, default: '#ffffff' })
  color: string;

  @Column({ type: 'varchar', length: 10, default: '22px' })
  fontSize: string;

  @Column({ type: 'boolean', default: false })
  isBlocked: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
