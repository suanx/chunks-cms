import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('movie_actors')
export class MovieActor {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true })
  movieId: number;

  @Column({ type: 'int', unsigned: true })
  actorId: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  roleName: string;
}
