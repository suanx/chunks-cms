import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { Video } from '../../videos/entities/video.entity';

@Entity('watch_histories')
@Index('idx_watch_history_user_video', ['userId', 'videoId'])
@Index('idx_watch_history_user_watched', ['userId', 'watchedAt'])
export class WatchHistory {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  userId: number;

  @Column({ type: 'int', unsigned: true })
  videoId: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  currentPosition: number; // 当前播放位置(秒)

  @Column({ type: 'int', unsigned: true, default: 0 })
  duration: number; // 视频总时长(秒)

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progress: number; // 播放进度百分比

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastPlayUrl: string; // 最后播放的URL(剧集切换)

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Video)
  @JoinColumn({ name: 'video_id' })
  video: Video;

  @CreateDateColumn()
  watchedAt: Date;
}
