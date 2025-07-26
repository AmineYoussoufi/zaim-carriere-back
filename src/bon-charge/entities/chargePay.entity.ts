import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BonCharge } from './bon-charge.entity';

@Entity()
export class ChargePay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  montant: number;

  @ManyToOne(() => BonCharge, (bon) => bon.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  bon: BonCharge;
}
