import { Bon } from 'src/bon/entities/bon.entity';
import { Entree } from 'src/entree/entities/entree.entity';
import { Vehicule } from 'src/vehicule/entities/vehicule.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: 'societe' | 'particulier';

  @Column({ nullable: true })
  identifiant: string;

  @OneToMany(() => Vehicule, (vehicule) => vehicule.client)
  vehicules: Vehicule;

  @OneToMany(() => Bon, (bon: Bon) => bon.client)
  bons: Bon[];

  @OneToMany(() => Entree, (entree: Entree) => entree.client)
  entrees: Entree[];
}
