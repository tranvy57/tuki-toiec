import { Expose, Type } from 'class-transformer';
import { CourseBand } from 'src/courses/consts';
import { PhaseDto } from 'src/phase/dto/phase.dto';
import { Column } from 'typeorm';

export class PlanDto {
  @Expose()
  @Expose()
  id?: string;

  @Expose()
  targetScore?: number;

  @Expose()
  startDate?: string;

  @Expose()
  totalDays?: number;

  @Expose()
  @Type(() => PhaseDto)
  phases: PhaseDto[];
}
