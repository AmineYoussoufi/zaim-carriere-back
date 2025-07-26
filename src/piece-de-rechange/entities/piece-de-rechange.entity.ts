import { Vehicule } from 'src/vehicule/entities/vehicule.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PieceDeRechange {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Vehicule, (vehicule: Vehicule) => vehicule.id)
  vehicule: Vehicule;

  @Column()
  libelle: string;

  @Column()
  prix: number;

  @Column()
  date: string;
}
