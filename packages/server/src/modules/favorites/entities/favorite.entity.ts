import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('favorites')
@Index('idx_favorites_user_id', ['userId'])
@Index('idx_favorites_video_id', ['videoId'])
@Index('idx_favorites_movie_id', ['movieId'])
@Index('idx_favorites_created_at', ['createdAt'])
@Index('idx_favorites_user_video', ['userId', 'videoId'], { unique: true })
export class Favorite {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', unsigned: true, nullable: true })
  videoId: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  movieId: number;

  @CreateDateColumn()
  createdAt: Date;
}
