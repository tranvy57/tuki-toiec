import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/user/entities/user.entity';

export enum UserCourseStatus {
  ACTIVE = 'active', // Đang học
  COMPLETED = 'completed', // Đã học xong
  EXPIRED = 'expired', // Hết hạn
  TRIAL = 'trial', // Học thử
}

@Entity('user_courses')
export class UserCourse extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userCourses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Course, (course) => course.userCourses, { eager: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({
    type: 'enum',
    enum: UserCourseStatus,
    default: UserCourseStatus.ACTIVE,
  })
  status: UserCourseStatus;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  purchaseDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expireDate?: Date;
}
