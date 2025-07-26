import { Fournisseur } from 'src/fournisseur/entities/fournisseur.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Charge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  montant: number;

  @Column()
  type: string;

  @Column()
  date: string;

  @Column()
  motif: string;

  @Column({ default: false })
  paye: boolean;

  @ManyToOne(() => Fournisseur, (fournisseur) => fournisseur.id, {
    onDelete: 'CASCADE',
  })
  fournisseur: Fournisseur;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}
