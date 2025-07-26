import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Depot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 6, scale: 2 })
  amount: number;

  @Column()
  date: string;
}
