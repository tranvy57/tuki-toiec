import { Expose, Type } from 'class-transformer';
import { PhaseDto } from 'src/phase/dto/phase.dto';

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
