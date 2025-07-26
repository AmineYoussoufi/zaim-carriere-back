import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Bon } from './bon.entity';

@Entity()
export class Paiement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  montant: number;

  @ManyToOne(() => Bon, (bon) => bon.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  bon: Bon;
}
