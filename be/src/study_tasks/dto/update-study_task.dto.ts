import { PartialType } from '@nestjs/swagger';
import { CreateStudyTaskDto } from './create-study_task.dto';

export class UpdateStudyTaskDto extends PartialType(CreateStudyTaskDto) {}
