import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('comments')
@Index('idx_comments_user_id', ['userId'])
@Index('idx_comments_video_id', ['videoId'])
@Index('idx_comments_movie_id', ['movieId'])
@Index('idx_comments_status', ['status'])
@Index('idx_comments_created_at', ['createdAt'])
@Index('idx_comments_parent_id', ['parentId'])
@Index('idx_comments_video_user', ['videoId', 'userId'])
@Index('idx_comments_movie_user', ['movieId', 'userId'])
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', unsigned: true })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', unsigned: true, nullable: true })
  videoId: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  movieId: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  parentId: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  replyToUserId: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  likeCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
