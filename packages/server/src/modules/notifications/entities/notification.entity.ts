import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notifications')
@Index('idx_notifications_user_read', ['userId', 'isRead'])
export class Notification {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  type: string; // system, comment_reply, new_content, favorite

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  relatedType: string; // video, movie, comment

  @Column({ type: 'int', unsigned: true, nullable: true })
  relatedId: number;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
