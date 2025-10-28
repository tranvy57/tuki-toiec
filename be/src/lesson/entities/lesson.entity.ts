import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { PhaseLesson } from 'src/phase_lessons/entities/phase_lesson.entity';
import { StudyTask } from 'src/study_tasks/entities/study_task.entity';
import { Unit } from 'src/unit/entities/unit.entity';
import { Question } from 'src/question/entities/question.entity';
import { LessonSkill } from 'src/lesson_skills/entities/lesson_skill.entity';
import { LessonContent } from 'src/lesson_content/entities/lesson_content.entity';

@Entity('lessons')
export class Lesson extends BaseEntity {
  @ManyToOne(() => Unit, (u) => u.lessons, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'unit_id', referencedColumnName: 'id' })
  unit?: Unit | null;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'plan',
  })
  type: 'plan' | 'exercise' | 'mock' | 'review' | 'ai';

  @Column({ type: 'varchar', length: 32, nullable: true })
  level?: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @OneToMany(() => PhaseLesson, (pl) => pl.lesson)
  phaseLessons: PhaseLesson[];

  @OneToMany(() => StudyTask, (t) => t.lesson)
  studyTasks: StudyTask[];

  @OneToMany(() => LessonContent, (lc) => lc.lesson, { cascade: true })
  contents?: LessonContent[];

  @OneToMany(() => LessonSkill, (ls) => ls.lesson, { cascade: true })
  skills: LessonSkill[];
}
