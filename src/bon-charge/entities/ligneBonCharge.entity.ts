import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BonCharge } from './bon-charge.entity';
import { Destination } from './destination.entity';
import { AchatType } from 'src/achat-type/entities/achat-type.entity';

@Entity()
export class LigneBonCharge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  quantite: number;

  @Column('decimal', {
    precision: 6,
    scale: 2,
    nullable: true,
    default: null,
  })
  aVoirQuantity: number | null;

  @Column({ type: 'float' })
  prix: number;

  @Column({ default: '' })
  produit: string;

  @ManyToOne(() => AchatType, (achatType) => achatType.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  destinationType: AchatType;

  @ManyToOne(() => BonCharge, (bon) => bon.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  bon: BonCharge;

  @OneToMany(() => Destination, (destination) => destination.line, {
    cascade: true,
  })
  destinations: Destination[];
}
