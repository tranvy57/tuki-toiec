import { Expose, Type } from 'class-transformer';
import { LessonDTO } from 'src/lesson/dto/lesson.dto';

export class PhaseLessonDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => LessonDTO)
  lesson?: LessonDTO;

  @Expose()
  order: number;
}
