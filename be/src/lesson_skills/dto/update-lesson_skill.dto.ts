import { PartialType } from '@nestjs/swagger';
import { CreateLessonSkillDto } from './create-lesson_skill.dto';

export class UpdateLessonSkillDto extends PartialType(CreateLessonSkillDto) {}
