import { Client } from 'src/client/entities/client.entity';
import { PieceDeRechange } from 'src/piece-de-rechange/entities/piece-de-rechange.entity';
import { Salarie } from 'src/salarie/entities/salarie.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Vehicule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  immatricule: string;

  @Column()
  type: string;

  @ManyToOne(() => Client, (client) => client.id)
  client: Client;

  @ManyToOne(() => Salarie, (salarie) => salarie.id) // Many-to-one with Salarie
  chauffeur: Salarie; // Driver is a Salarie

  @OneToMany(
    () => PieceDeRechange,
    (pieceDeRechange) => pieceDeRechange.vehicule,
  )
  piecesDeRechange: PieceDeRechange[];
}
