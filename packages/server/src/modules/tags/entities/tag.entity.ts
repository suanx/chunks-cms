import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 30, unique: true, nullable: true })
  slug: string;

  @Column({ type: 'varchar', length: 7, default: '#409EFF' })
  color: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  usageCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
