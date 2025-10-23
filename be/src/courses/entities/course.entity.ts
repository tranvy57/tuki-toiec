import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { CourseBand } from '../consts';
import { UserCourse } from 'src/user_courses/entities/user_course.entity';
import { Phase } from 'src/phase/entities/phase.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Order } from 'src/order/entities/order.entity';

@Entity('courses')
export class Course extends BaseEntity {
  @Column({ unique: true })
  title: string;

  @Column({
    type: 'enum',
    enum: CourseBand,
  })
  band: CourseBand;

  @Column({ type: 'int', default: 60 })
  durationDays: number;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => UserCourse, (uc) => uc.course)
  userCourses?: UserCourse[];

  @OneToMany(() => Plan, (p) => p.course)
  plans?: Plan[];

  @OneToMany(() => Order, (o) => o.course)
  orders?: Order[];

  @OneToMany(() => Phase, (p) => p.course)
  phases: Phase[];
}
