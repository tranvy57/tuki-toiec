import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Plan } from 'src/plan/entities/plan.entity';

export type StudyTaskStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'skipped';
export type StudyTaskMode = 'learn' | 'review' | 'mock_test';

@Entity('study_tasks')
export class StudyTask extends BaseEntity {
  @ManyToOne(() => Plan, (p) => p.studyTasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id', referencedColumnName: 'id' })
  @Index()
  plan: Plan;

  @ManyToOne(() => Lesson, (l) => l.studyTasks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'lesson_id', referencedColumnName: 'id' })
  lesson?: Lesson | null;

  @Column({
    name: 'content_url',
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  contentUrl?: string;

  @Column({ type: 'varchar', length: 16, default: 'pending' })
  status: StudyTaskStatus;

  @Column({ type: 'varchar', length: 16, default: 'learn' })
  mode: StudyTaskMode;
}
