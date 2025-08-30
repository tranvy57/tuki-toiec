import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity('vocabularies')
export class Vocabulary extends BaseEntity {
  word: string;
  meaning: string;
  example: string;
  pronunciation: string;

  @ManyToMany(() => User, (user) => user.vocabularies)
  users: User[];
}
