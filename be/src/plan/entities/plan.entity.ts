import { BaseEntity } from 'src/common/entities/base.entity';
import { Phase } from 'src/phase/entities/phase.entity';
import { StudyTask } from 'src/study_tasks/entities/study_task.entity';
import { TargetSkill } from 'src/target_skills/entities/target_skill.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('plans')
export class Plan extends BaseEntity {
  @ManyToOne(() => User, (u) => u.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @Index()
  user: User;

  @Column({ name: 'target_score', type: 'int', nullable: true })
  targetScore?: number;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate?: string;

  @Column({ name: 'total_days', type: 'int', nullable: true })
  totalDays?: number;

  @OneToMany(() => Phase, (p) => p.plan)
  phases: Phase[];

  @OneToMany(() => StudyTask, (t) => t.plan)
  studyTasks: StudyTask[];

  @OneToMany(() => TargetSkill, (ts) => ts.plan)
  targetSkills: TargetSkill[];
}
