import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('audit_logs')
@Index('idx_audit_user_id', ['userId'])
@Index('idx_audit_action', ['action'])
@Index('idx_audit_module', ['module'])
@Index('idx_audit_created_at', ['createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Column({ type: 'varchar', length: 50 })
  module: string;

  @Column({ type: 'int', unsigned: true, nullable: true })
  targetId: number;

  @Column({ type: 'text', nullable: true })
  detail: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;
}
