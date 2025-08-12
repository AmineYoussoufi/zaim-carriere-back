import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AchatType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  libelle: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  actif: boolean;

  @Column({
    type: 'enum',
    enum: ['PIECE', 'SERVICE', 'FOURNITURE'],
    default: 'PIECE',
  })
  categorie: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
