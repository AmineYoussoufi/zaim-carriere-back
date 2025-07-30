import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Devis } from './devis.entity';
import { Produit } from 'src/produit/entities/produit.entity';

@Entity()
export class LigneDevis {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Produit, (produit) => produit.id)
  produit: Produit;

  @Column('decimal', { precision: 10, scale: 2 })
  prix: number;

  @Column('decimal', { precision: 10, scale: 2 })
  quantite: number;

  @ManyToOne(() => Devis, (devis) => devis.lignes)
  devis: Devis;
}
// This entity represents a line item in a quotation (devis) with a product, price, and quantity.
// It is linked to a specific quotation and product, allowing for detailed tracking of items included in
