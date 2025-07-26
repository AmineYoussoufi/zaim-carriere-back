import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Salarie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  salaire: number;

  @Column()
  date: string;
}
