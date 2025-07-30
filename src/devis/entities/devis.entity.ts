import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LigneDevis } from './ligneDevis.entity';
import { Client } from 'src/client/entities/client.entity';

@Entity()
export class Devis {
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

  @Column({ type: 'text', nullable: true })
  deliveryAdress: string;

  @Column({ default: 'En attente' }) // Possible values: 'En attente', 'Accepté', 'Refusé', 'Expiré'
  statut: string;

  @ManyToOne(() => Client, (client) => client.id)
  client: Client;

  @Column()
  numero: string;

  @OneToMany(() => LigneDevis, (ligne) => ligne.devis, {
    cascade: ['insert', 'update'],
  })
  lignes: LigneDevis[];

  @Column({ type: 'text', nullable: true })
  notes: string; // Additional notes field for any special instructions
}
