import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Skill } from 'src/skill/entities/skill.entity';

@Entity('user_progress')
@Unique('UQ_user_skill', ['user', 'skill'])
export class UserProgress extends BaseEntity {
  @ManyToOne(() => User, (u) => u.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @Index()
  user: User;

  @ManyToOne(() => Skill, (s) => s.userProgresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skill_id', referencedColumnName: 'id' })
  @Index()
  skill: Skill;

  @Column({ type: 'float', default: 0 })
  proficiency: number; // 0..1
}
