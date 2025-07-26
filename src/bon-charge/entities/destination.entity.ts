// src/destinations/entities/destination.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Vehicule } from '../../vehicule/entities/vehicule.entity';
import { Machine } from '../../machine/entities/machine.entity';
import { LigneBonCharge } from './ligneBonCharge.entity';

export enum DestinationType {
  STOCK = 'stock',
  VEHICLE = 'vehicle',
  MACHINE = 'machine',
}

@Entity()
export class Destination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: DestinationType,
    default: DestinationType.STOCK,
  })
  destination: DestinationType;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => LigneBonCharge, (line) => line.destinations)
  @JoinColumn({ name: 'line_id' })
  line: LigneBonCharge;

  @ManyToOne(() => Vehicule, { nullable: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicule | null;

  @ManyToOne(() => Machine, { nullable: true })
  @JoinColumn({ name: 'machine_id' })
  machine: Machine | null;
}
