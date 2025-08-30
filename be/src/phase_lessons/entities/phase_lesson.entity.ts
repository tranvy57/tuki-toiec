import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Phase } from 'src/phase/entities/phase.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';

@Entity('phase_lessons')
@Unique('UQ_phase_lesson', ['phase', 'lesson'])
export class PhaseLesson extends BaseEntity {
  @ManyToOne(() => Phase, (p) => p.phaseLessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'phase_id', referencedColumnName: 'id' })
  @Index()
  phase: Phase;

  @ManyToOne(() => Lesson, (l) => l.phaseLessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id', referencedColumnName: 'id' })
  @Index()
  lesson: Lesson;

  @Column({ type: 'int', default: 0 })
  order: number;
}
