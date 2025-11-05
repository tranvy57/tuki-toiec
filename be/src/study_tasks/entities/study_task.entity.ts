import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { LessonContent } from 'src/lesson_content/entities/lesson_content.entity';

export type StudyTaskStatus =
  | 'pending'
  | 'locked'
  | 'completed'
  | 'skipped';

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
  lesson: Lesson;

  @Column({ type: 'varchar', length: 16, default: 'pending' })
  status: StudyTaskStatus;

  @ManyToOne(() => LessonContent, (lc) => lc.studyTasks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'lesson_content_id', referencedColumnName: 'id' })
  lessonContent: LessonContent;
}
