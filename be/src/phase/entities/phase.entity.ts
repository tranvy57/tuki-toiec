import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { PhaseLesson } from 'src/phase_lessons/entities/phase_lesson.entity';
import { Course } from 'src/courses/entities/course.entity';

export type PhaseStatus = 'locked' | 'active' | 'done';

@Entity('phases')
export class Phase extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 16, default: 'locked' })
  status: PhaseStatus;

  @Column({ type: 'int', default: 0 })
  order: number;

  // Cờ tuỳ ý (ví dụ: milestone, review, mock_test…)
  @Column({ type: 'varchar', length: 32, nullable: true })
  flag?: string;

  @Column({ name: 'start_at', type: 'timestamptz', nullable: true })
  startAt?: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt?: Date;

  @OneToMany(() => PhaseLesson, (pl) => pl.phase)
  phaseLessons: PhaseLesson[];

  @ManyToOne(() => Course, (c) => c.phases)
  @JoinColumn({ name: 'course_id' })
  course?: Course;
}
