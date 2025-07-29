// src/vidange/entities/vidange.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vehicule } from '../../vehicule/entities/vehicule.entity';
import { Machine } from '../../machine/entities/machine.entity';

@Entity()
export class Vidange {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'float' })
  cout: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'float', default: 0 })
  kilometrage: number;

  @Column({ type: 'float', default: 0 })
  heures_moteur: number;

  @Column({ nullable: true })
  type_vidange: string;

  // Relationship with Vehicule (nullable)
  @ManyToOne(() => Vehicule, { nullable: true })
  vehicule: Vehicule;

  // Relationship with Machine (nullable)
  @ManyToOne(() => Machine, { nullable: true })
  machine: Machine;

  @Column({ name: 'vehicule_id', nullable: true })
  vehiculeId: number;

  @Column({ name: 'machine_id', nullable: true })
  machineId: number;
}
