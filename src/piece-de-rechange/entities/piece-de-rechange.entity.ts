import { Machine } from 'src/machine/entities/machine.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Vehicule } from 'src/vehicule/entities/vehicule.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PieceDeRechange {
  @PrimaryGeneratedColumn()
  id: number;

  // Relationship to Stock
  @ManyToOne(() => Stock, (stock) => stock.id)
  stock: Stock;

  // Optional relationship to Vehicule
  @ManyToOne(() => Vehicule, (vehicule) => vehicule.piecesDeRechange, {
    nullable: true,
  })
  vehicule: Vehicule | null;

  // Optional relationship to Machine
  @ManyToOne(() => Machine, (machine) => machine.piecesDeRechange, {
    nullable: true,
  })
  machine: Machine | null;

  @Column()
  date: Date;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'float', default: 1 })
  quantity: number;
}
