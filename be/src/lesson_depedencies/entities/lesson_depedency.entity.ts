import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';

@Entity('lesson_dependencies')
@Unique('UQ_lesson_vs_before', ['lesson', 'lessonBefore'])
export class LessonDependency extends BaseEntity {
  @ManyToOne(() => Lesson, (l) => l.prerequisitesOf, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id', referencedColumnName: 'id' })
  lesson: Lesson;

  @ManyToOne(() => Lesson, (l) => l.asPrerequisiteFor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_before_id', referencedColumnName: 'id' })
  lessonBefore: Lesson;

  @Column({ name: 'min_proficiency', type: 'float', default: 0 })
  minProficiency: number;
}
