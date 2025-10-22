import { BaseEntity } from 'src/common/entities/base.entity';
import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Course, (course) => course.orders)
  @JoinColumn({ name: 'course_id', referencedColumnName: 'id' })
  course: Course;
}
