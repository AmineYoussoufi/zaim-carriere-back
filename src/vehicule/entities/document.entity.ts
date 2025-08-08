// src/vehicule/entities/document.entity.ts
import { Vehicule } from './vehicule.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  numero: string;

  @Column({ type: 'date' })
  dateEmission: Date;

  @Column({ type: 'date' })
  dateExpiration: Date;

  @Column({ nullable: true })
  filePath: string;

  @Column({ nullable: true })
  originalFileName: string;

  @Column({ nullable: true })
  fileSize: number;

  @Column({ nullable: true })
  mimeType: string;

  @ManyToOne(() => Vehicule, (vehicule) => vehicule.documents)
  vehicule: Vehicule;
}
