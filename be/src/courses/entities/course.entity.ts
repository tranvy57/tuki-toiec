import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { CourseBand } from '../consts';
import { UserCourse } from 'src/user_courses/entities/user_course.entity';

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
}
