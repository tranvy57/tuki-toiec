import { PartialType } from '@nestjs/swagger';
import { CreateLessonContentDto } from './create-lesson_content.dto';

export class UpdateLessonContentDto extends PartialType(CreateLessonContentDto) {}
