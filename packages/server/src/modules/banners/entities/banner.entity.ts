import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('banners')
@Index('idx_banners_position', ['position'])
@Index('idx_banners_is_active', ['isActive'])
@Index('idx_banners_sort_order', ['sortOrder'])
@Index('idx_banners_created_at', ['createdAt'])
export class Banner {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 500 })
  imageUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  linkUrl: string;

  @Column({ type: 'tinyint', default: 1 })
  linkType: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  targetType: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  targetId: number;

  @Column({ type: 'varchar', length: 30, default: 'home' })
  position: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'tinyint', default: 1 })
  isActive: number;

  @Column({ type: 'datetime', nullable: true })
  startTime: Date;

  @Column({ type: 'datetime', nullable: true })
  endTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
