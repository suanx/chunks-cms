import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Movie } from './movie.entity';

@Entity('episodes')
export class Episode {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  movieId: number;

  @ManyToOne(() => Movie, (movie) => movie.episodes)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'int', unsigned: true })
  episodeNumber: number;

  @Column({ type: 'int', unsigned: true, default: 1 })
  seasonNumber: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  videoUrl: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  videoKey: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  duration: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverUrl: string;

  @Column({ type: 'tinyint', default: 0 })
  status: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
