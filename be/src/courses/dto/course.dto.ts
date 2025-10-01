import { Expose, Type } from 'class-transformer';
import { CourseBand } from '../consts';
import { PhaseDto } from 'src/phase/dto/phase.dto';

export class CourseDto {
  @Expose()
  id?: string;
  @Expose()
  title: string;

  @Expose()
  band: CourseBand;

  @Expose()
  durationDays: number;

  @Expose()
  price: number;

  @Expose()
  description?: string;

  @Expose()
  @Type(() => PhaseDto)
  phases?: PhaseDto[];
}
