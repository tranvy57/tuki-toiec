import { PartialType } from '@nestjs/swagger';
import { CreatePhaseLessonDto } from './create-phase_lesson.dto';

export class UpdatePhaseLessonDto extends PartialType(CreatePhaseLessonDto) {}
