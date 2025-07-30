import { Salarie } from 'src/salarie/entities/salarie.entity';
import { Vehicule } from 'src/vehicule/entities/vehicule.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Carburant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero: string;

  @ManyToOne(() => Vehicule, (vehicule) => vehicule.id, { nullable: false })
  vehicule: Vehicule;

  @ManyToOne(() => Salarie, (salarie) => salarie.id, { nullable: true })
  salarie: Salarie;

  @Column('int', { nullable: true })
  compteur: number;

  @Column('decimal', { precision: 10, scale: 2 })
  liters: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column()
  date: string;

  // Computed property (not persisted in the database)
  get totalPrice(): number {
    return Number(this.liters) * Number(this.unitPrice);
  }
}
