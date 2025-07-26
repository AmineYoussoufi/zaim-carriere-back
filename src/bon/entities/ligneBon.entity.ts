import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Bon } from './bon.entity';
import { Produit } from 'src/produit/entities/produit.entity';

@Entity()
export class LigneBon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 6, scale: 2 })
  quantite: number;

  @Column('decimal', { precision: 6, scale: 2 })
  prix: number;

  @ManyToOne(() => Produit, (produit) => produit.id)
  produit: Produit;

  @ManyToOne(() => Bon, (bon) => bon.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  bon: Bon;
}
