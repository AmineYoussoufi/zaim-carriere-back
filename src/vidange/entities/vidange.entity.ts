// src/vidange/entities/vidange.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
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

  @Column({ type: 'float' })
  kilometrage: number;

  @Column({ type: 'float' })
  heures_moteur: number;

  @Column({ nullable: true })
  type_vidange: string;

  // Relationship with Vehicule (nullable)
  @ManyToOne(() => Vehicule, { nullable: true })
  @JoinColumn({ name: 'vehicule_id' })
  vehicule: Vehicule;

  // Relationship with Machine (nullable)
  @ManyToOne(() => Machine, { nullable: true })
  @JoinColumn({ name: 'machine_id' })
  machine: Machine;

  @Column({ name: 'vehicule_id', nullable: true })
  vehiculeId: number;

  @Column({ name: 'machine_id', nullable: true })
  machineId: number;
}
