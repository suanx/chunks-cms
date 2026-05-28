import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany, DeleteDateColumn, Index } from 'typeorm';
import { Episode } from './episode.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('movies')
@Index('idx_movies_status', ['status'])
@Index('idx_movies_type', ['type'])
@Index('idx_movies_created_at', ['createdAt'])
@Index('idx_movies_view_count', ['viewCount'])
@Index('idx_movies_sort_order', ['sortOrder'])
@Index('idx_movies_release_year', ['releaseYear'])
export class Movie {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 250, unique: true, nullable: true })
  slug: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  originalTitle: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  backdropUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  trailerUrl: string;

  @Column({ type: 'tinyint', default: 1 })
  type: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  genre: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  region: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  language: string;

  @Column({ type: 'smallint', nullable: true })
  releaseYear: number;

  @Column({ type: 'date', nullable: true })
  releaseDate: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  totalEpisodes: number;

  @Column({ type: 'tinyint', default: 0 })
  status: number;

  @Column({ type: 'tinyint', default: 0 })
  isEnded: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rateAvg: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  rateCount: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  viewCount: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  favoriteCount: number;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  director: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  actorsDesc: string;

  @OneToMany(() => Episode, (ep) => ep.movie)
  episodes: Episode[];

  @ManyToMany(() => Category)
  @JoinTable({ name: 'movie_categories', joinColumn: { name: 'movie_id' }, inverseJoinColumn: { name: 'category_id' } })
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  publishedAt: Date; // 定时发布时间

  @DeleteDateColumn()
  deletedAt: Date;
}

