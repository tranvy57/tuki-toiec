import { Attempt } from 'src/attempt/entities/attempt.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Order } from 'src/order/entities/order.entity';
import { Role } from 'src/role/entities/role.entity';
import { SpeakingAttempt } from 'src/speaking-attempt/entities/speaking-attempt.entity';
import { UserCourse } from 'src/user_courses/entities/user_course.entity';
import { UserVocabulary } from 'src/user_vocabularies/entities/user_vocabulary.entity';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'display_name' })
  displayName: string;

  @Column()
  email: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @OneToMany(() => UserVocabulary, (uv) => uv.user)
  userVocabularies: UserVocabulary[];

  @OneToMany(() => Attempt, (attempt) => attempt.user)
  @JoinColumn({ name: 'user_id' })
  attempts: Attempt[];

  @OneToMany(() => UserCourse, (uc) => uc.user)
  userCourses?: UserCourse[];

  @OneToMany(() => SpeakingAttempt, (sa) => sa.user)
  speakingAttempts?: SpeakingAttempt[];

  @OneToMany(() => Order, (order) => order.user)
  orders?: Order[];
}
