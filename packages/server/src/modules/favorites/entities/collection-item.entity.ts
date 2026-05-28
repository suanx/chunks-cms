import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CollectionFolder } from './collection-folder.entity';

@Entity('collection_items')
export class CollectionItem {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  folderId: number;

  @Column({ type: 'int', unsigned: true })
  videoId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => CollectionFolder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'folder_id' })
  folder: CollectionFolder;
}
