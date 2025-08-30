import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { PhaseLesson } from 'src/phase_lessons/entities/phase_lesson.entity';
import { LessonDependency } from 'src/lesson_depedencies/entities/lesson_depedency.entity';
import { StudyTask } from 'src/study_tasks/entities/study_task.entity';
import { Unit } from 'src/unit/entities/unit.entity';

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

  @Column({ type: 'varchar', length: 32, nullable: true })
  level?: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @OneToMany(() => PhaseLesson, (pl) => pl.lesson)
  phaseLessons: PhaseLesson[];

  @OneToMany(() => LessonDependency, (ld) => ld.lesson)
  prerequisitesOf: LessonDependency[];

  @OneToMany(() => LessonDependency, (ld) => ld.lessonBefore)
  asPrerequisiteFor: LessonDependency[];

  @OneToMany(() => StudyTask, (t) => t.lesson)
  studyTasks: StudyTask[];
}
