import { Client } from 'src/client/entities/client.entity';
import { Fournisseur } from 'src/fournisseur/entities/fournisseur.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Check {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  checkNumber: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ default: false })
  encaisse: boolean;

  @Column({ default: 'client' })
  type: 'client' | 'fournisseur'; // To track the type of association

  @ManyToOne(() => Client, { nullable: true })
  client: Client;

  @ManyToOne(() => Fournisseur, { nullable: true })
  fournisseur: Fournisseur;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
