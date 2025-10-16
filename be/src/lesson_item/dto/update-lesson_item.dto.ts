import { PartialType } from '@nestjs/swagger';
import { CreateLessonItemDto } from './create-lesson_item.dto';

export class UpdateLessonItemDto extends PartialType(CreateLessonItemDto) {}
