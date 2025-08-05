import { Bon } from 'src/bon/entities/bon.entity';
import { Carburant } from 'src/carburant/entities/carburant.entity';
import { Client } from 'src/client/entities/client.entity';
import { PieceDeRechange } from 'src/piece-de-rechange/entities/piece-de-rechange.entity';
import { Salarie } from 'src/salarie/entities/salarie.entity';
import { Vidange } from 'src/vidange/entities/vidange.entity';
import { VisiteTechnique } from 'src/visite-technique/entities/visite-technique.entity';
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

  @Column({ nullable: true })
  marque: string;

  @Column({ nullable: true })
  modele: string;

  @Column({ nullable: true })
  kilometrageVidange: number;

  @ManyToOne(() => Client, (client) => client.id)
  client: Client;

  @ManyToOne(() => Salarie, (salarie) => salarie.id) // Many-to-one with Salarie
  chauffeur: Salarie; // Driver is a Salarie

  @OneToMany(() => PieceDeRechange, (piece) => piece.vehicule)
  piecesDeRechange: PieceDeRechange[];

  @OneToMany(() => Bon, (bon) => bon.vehicule)
  bons: Bon[];

  @OneToMany(() => Carburant, (carburant) => carburant.vehicule)
  carburants: Carburant[];

  @OneToMany(() => Vidange, (vidange) => vidange.vehicule)
  vidanges: Vidange[];

  @OneToMany(
    () => VisiteTechnique,
    (visiteTechnique) => visiteTechnique.vehicule,
  )
  visitesTechniques: VisiteTechnique[];
}
