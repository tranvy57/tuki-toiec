import { PartialType } from '@nestjs/swagger';
import { CreateLessonDepedencyDto } from './create-lesson_depedency.dto';

export class UpdateLessonDepedencyDto extends PartialType(CreateLessonDepedencyDto) {}
