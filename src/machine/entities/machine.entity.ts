// src/machines/entities/machine.entity.ts
import { PieceDeRechange } from 'src/piece-de-rechange/entities/piece-de-rechange.entity';
import { Produit } from 'src/produit/entities/produit.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Machine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  type: string;

  @OneToMany(
    () => PieceDeRechange,
    (pieceDeRechange) => pieceDeRechange.machine,
  )
  piecesDeRechange: PieceDeRechange[];

  @OneToMany(() => Produit, (produit) => produit.machine, {
    cascade: true,
    eager: true, // Load products automatically when loading machine
  })
  produits: Produit[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
