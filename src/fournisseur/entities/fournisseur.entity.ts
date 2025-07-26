// fournisseur.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Fournisseur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ice: string;

  @Column()
  nom: string;

  @Column()
  responsable: string;

  @Column()
  email: string;

  @Column()
  telephone: string;
}
