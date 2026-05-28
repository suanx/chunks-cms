import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('video_encodings')
@Index('idx_video_encoding_status', ['videoId', 'status'])
export class VideoEncoding {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  videoId: number;

  @Column({ type: 'varchar', length: 20 })
  targetResolution: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string; // pending, processing, completed, failed

  @Column({ type: 'text', nullable: true })
  outputPath: string;

  @Column({ type: 'int', default: 0 })
  progress: number; // 0-100

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
