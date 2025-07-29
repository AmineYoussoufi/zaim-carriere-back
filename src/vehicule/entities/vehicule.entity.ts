import { Client } from 'src/client/entities/client.entity';
import { PieceDeRechange } from 'src/piece-de-rechange/entities/piece-de-rechange.entity';
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

  @OneToMany(
    () => PieceDeRechange,
    (pieceDeRechange) => pieceDeRechange.vehicule,
  )
  piecesDeRechange: PieceDeRechange[];
}
