// src/visite-technique/entities/visite-technique.entity.ts
import { Vehicule } from '../../vehicule/entities/vehicule.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VisiteTechnique {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  kilometrage: number;

  @Column({ type: 'enum', enum: ['Valide', 'Non valide'], default: 'Valide' })
  resultat: string;

  @Column({ type: 'date' })
  prochaineVisite: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montant: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Vehicule, (vehicule) => vehicule.visitesTechniques)
  vehicule: Vehicule;
}
