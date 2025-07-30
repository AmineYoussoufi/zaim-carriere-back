import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LigneBon } from './ligneBon.entity';
import { Client } from 'src/client/entities/client.entity';
import { Vehicule } from 'src/vehicule/entities/vehicule.entity';
import { Paiement } from './paiement.entity';

@Entity()
export class Bon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: new Date().getDate() })
  jour: number;

  @Column({ default: new Date().getMonth() + 1 })
  mois: number;

  @Column({ default: new Date().getFullYear() })
  annee: number;

  @Column({ default: 0 })
  transport: number;

  @Column({ default: 0 })
  remise: number;

  @Column({ type: 'float', default: 0 })
  montant: number;

  @ManyToOne(() => Vehicule, (vehicule) => vehicule.id)
  vehicule: Vehicule;

  @ManyToOne(() => Client, (client) => client.id)
  client: Client;

  @Column()
  numero: string;

  @OneToMany(() => LigneBon, (ligne) => ligne.bon, {
    cascade: ['insert', 'update'],
  })
  lignes: LigneBon[];

  @OneToMany(() => Paiement, (paiement) => paiement.bon, {
    cascade: ['insert', 'update'],
  })
  paiements: Paiement[];
}
