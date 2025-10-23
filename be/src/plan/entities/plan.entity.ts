import { BaseEntity } from 'src/common/entities/base.entity';
import { CourseBand } from 'src/courses/consts';
import { Course } from 'src/courses/entities/course.entity';
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

  @Column({
    name: 'start_date',
    type: 'date',
    nullable: true,
    default: () => 'CURRENT_DATE',
  })
  startDate?: string;

  @Column({
    type: 'varchar',
    length: 16,
    default: 'in_progress',
  })
  status: 'in_progress' | 'completed' | 'paused';

  @OneToMany(() => StudyTask, (t) => t.plan)
  studyTasks: StudyTask[];

  @OneToMany(() => TargetSkill, (ts) => ts.plan)
  targetSkills: TargetSkill[];

  @Column({
    type: 'enum',
    enum: CourseBand,
    nullable: true,
  })
  band?: CourseBand;

  @ManyToOne(() => Course, (c) => c.plans, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'course_id', referencedColumnName: 'id' })
  course?: Course;
}
