import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class StockOperation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['in', 'out'] })
  type: 'in' | 'out';

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
