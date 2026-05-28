import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn, DeleteDateColumn, Index } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';

@Entity('videos')
@Index('idx_videos_status', ['status'])
@Index('idx_videos_created_at', ['createdAt'])
@Index('idx_videos_view_count', ['viewCount'])
@Index('idx_videos_sort_order', ['sortOrder'])
@Index('idx_videos_status_created', ['status', 'createdAt'])
@Index('idx_videos_category', ['categoryId'])
export class Video {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 250, unique: true, nullable: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverUrl: string;

  @Column({ type: 'varchar', length: 500 })
  videoUrl: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  videoKey: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  duration: number;

  @Column({ type: 'bigint', unsigned: true, default: 0 })
  fileSize: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  resolution: string;

  @Column({ type: 'tinyint', default: 0 })
  status: number;

  @Column({ type: 'tinyint', default: 0 })
  publishStatus: number;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  viewCount: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  likeCount: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  commentCount: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  source: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  sourceUrl: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  uploaderId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'uploader_id' })
  uploader: User;

  @ManyToMany(() => Category)
  @JoinTable({ name: 'video_categories', joinColumn: { name: 'video_id' }, inverseJoinColumn: { name: 'category_id' } })
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  publishedAt: Date; // 定时发布时间

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  encodeStatus: string; // pending, processing, completed, failed

  @Column({ type: 'json', nullable: true })
  encodeResult: any; // { '1080p': url, '720p': url, '480p': url }

  @DeleteDateColumn()
  deletedAt: Date;
}
