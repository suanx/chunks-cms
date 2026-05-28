import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  slug: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  parentId: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  icon: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverUrl: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string;

  @Column({ type: 'tinyint', default: 1 })
  type: number;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'tinyint', default: 1 })
  isVisible: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  videoCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
