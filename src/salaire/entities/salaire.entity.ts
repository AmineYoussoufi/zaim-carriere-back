import { Salarie } from 'src/salarie/entities/salarie.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Salaire {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Salarie, (salarie: Salarie) => salarie.id, {
    onDelete: 'CASCADE',
  })
  salarie: Salarie;

  @Column('decimal', { precision: 6, scale: 2 })
  amount: number;

  @Column()
  date: string;

  @Column()
  month: string;
}
