import { Machine } from 'src/machine/entities/machine.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Produit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  prix: number;

  @ManyToOne(() => Machine, (machine) => machine.produits)
  machine: Machine[];
}
