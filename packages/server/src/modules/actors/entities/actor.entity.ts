import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('actors')
export class Actor {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  englishName: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar: string;

  @Column({ type: 'date', nullable: true })
  birthDate: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  birthPlace: string;

  @Column({ type: 'int', nullable: true })
  height: number;

  @Column({ type: 'text', nullable: true })
  biography: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  worksCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
