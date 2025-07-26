// bonCharge.entity.ts
import { Fournisseur } from 'src/fournisseur/entities/fournisseur.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { LigneBonCharge } from './ligneBonCharge.entity';
import { ChargePay } from './chargePay.entity';

@Entity()
export class BonCharge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numero: string;

  @Column()
  montant: number;

  @Column()
  dateEmission: string;

  @Column()
  type: string;

  @Column()
  numeroRef: string;

  @OneToMany(() => LigneBonCharge, (ligne) => ligne.bon, {
    cascade: ['insert', 'update'],
  })
  lignes: LigneBonCharge[];

  @OneToMany(() => ChargePay, (paiement) => paiement.bon, {
    cascade: true,
  })
  paiements: ChargePay[];

  @ManyToOne(() => Fournisseur, (fournisseur: Fournisseur) => fournisseur.id, {
    cascade: ['insert', 'remove', 'update'],
  })
  fournisseur: Fournisseur;
}
