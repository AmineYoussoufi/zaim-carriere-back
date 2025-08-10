// src/production/entities/production.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Machine } from '../../machine/entities/machine.entity';
import { Produit } from 'src/produit/entities/produit.entity';

@Entity()
export class Production {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Machine, (machine) => machine.id)
  machine: Machine;

  @Column('int')
  quantity: number;

  @Column('timestamp')
  startDate: Date;

  @Column('timestamp')
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ['planned', 'in_progress', 'completed', 'cancelled'],
    default: 'planned',
  })
  status: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
