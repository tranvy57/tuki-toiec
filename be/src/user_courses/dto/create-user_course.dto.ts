import { IsString, IsEnum } from 'class-validator';
import { CourseBand } from 'src/courses/consts';

export class CreateUserCourseDto {
  @IsEnum(CourseBand)
  band: CourseBand;
}
