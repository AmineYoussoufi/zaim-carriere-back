import { Client } from 'src/client/entities/client.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vehicule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  immatricule: string;

  @Column()
  type: string;

  @ManyToOne(() => Client, (client) => client.id)
  client: Client;
}
