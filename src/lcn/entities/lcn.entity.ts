import { Client } from 'src/client/entities/client.entity';
import { Fournisseur } from 'src/fournisseur/entities/fournisseur.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Lcn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  checklcnNumber: string;

  @Column({ nullable: true })
  bank: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ default: false })
  encaisse: boolean;

  @Column({ nullable: true })
  type: 'client' | 'fournisseur'; // To track the type of association

  @ManyToOne(() => Client, { nullable: true })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @ManyToOne(() => Fournisseur, { nullable: true })
  @JoinColumn({ name: 'fournisseurId' })
  fournisseur: Fournisseur;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
