import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

@Entity('orders')
export class Order extends BaseEntity {

  @Column({ unique: true })
  code: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: OrderStatus;

  @Column({ nullable: true }) bankCode?: string;
  @Column({ nullable: true }) vnpTransactionNo?: string;
  @Column({ nullable: true }) vnpPayDate?: string;
}
