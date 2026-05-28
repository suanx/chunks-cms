import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('recommendations')
@Index('idx_recommendations_user', ['userId', 'type'])
export class Recommendation {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  userId: number; // null = 全站推荐

  @Column({ type: 'varchar', length: 50 })
  type: string; // video, movie

  @Column({ type: 'int', unsigned: true })
  targetId: number;

  @Column({ type: 'varchar', length: 20, default: 'manual' })
  source: string; // manual, algorithm, trending

  @Column({ type: 'int', default: 0 })
  score: number; // 推荐分数

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
