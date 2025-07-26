import { Client } from 'src/client/entities/client.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Entree {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  montant: number;

  @Column()
  type: string;

  @Column()
  date: string;

  @ManyToOne(() => Client, (client) => client.id, { onDelete: 'CASCADE' })
  client: Client;
}
