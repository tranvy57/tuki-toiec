import { PartialType } from '@nestjs/swagger';
import { CreateUserCourseDto } from './create-user_course.dto';

export class UpdateUserCourseDto extends PartialType(CreateUserCourseDto) {}
