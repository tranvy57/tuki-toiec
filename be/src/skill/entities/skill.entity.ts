import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { UserProgress } from 'src/user_progress/entities/user_progress.entity';

@Entity('skills')
export class Skill extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  code: string;

  @OneToMany(() => UserProgress, (up) => up.skill)
  userProgresses: UserProgress[];
}
