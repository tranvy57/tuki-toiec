import { Expose, Type } from 'class-transformer';
import { PhaseLessonDto } from 'src/phase_lessons/dto/phase-lesson.dto';

export type PhaseStatus = 'locked' | 'active' | 'done';

export class PhaseDto {
  @Expose()
  id: string;
  @Expose()
  title: string;

  @Expose()
  status: PhaseStatus;

  @Expose()
  order: number;

  @Expose()
  flag?: string;

  @Expose()
  startAt?: Date;

  @Expose()
  completedAt?: Date;

  @Expose()
  @Type(() => PhaseLessonDto)
  phaseLessons?: PhaseLessonDto[];
}
