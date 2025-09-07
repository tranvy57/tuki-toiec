import { Attempt } from 'src/attempt/entities/attempt.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Role } from 'src/role/entities/role.entity';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';
import {
  Column,
  Entity,
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

  @ManyToMany(() => Vocabulary, (vocabulary) => vocabulary.users)
  @JoinTable({
    name: 'user_vocabularies',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'vocabulary_id',
      referencedColumnName: 'id',
    },
  })
  vocabularies: Vocabulary[];

  @OneToMany(() => Attempt, (attempt) => attempt.user)
  attempts: Attempt[];
}
