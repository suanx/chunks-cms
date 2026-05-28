import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  targetType: string; // video, movie, comment

  @Column({ type: 'int', unsigned: true })
  targetId: number;

  @Column({ type: 'int', default: 0 })
  status: number; // 0=待审核 1=通过 2=不通过

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  reviewerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;
}
