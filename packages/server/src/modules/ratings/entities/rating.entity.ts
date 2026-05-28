import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('ratings')
@Index('idx_ratings_user_id', ['userId'])
@Index('idx_ratings_video_id', ['videoId'])
@Index('idx_ratings_movie_id', ['movieId'])
@Index('idx_ratings_score', ['score'])
@Index('idx_ratings_created_at', ['createdAt'])
@Index('idx_ratings_user_video', ['userId', 'videoId'], { unique: true })
export class Rating {
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

  @Column({ type: 'tinyint' })
  score: number;

  @Column({ type: 'text', nullable: true })
  review: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
