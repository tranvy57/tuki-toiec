import { PartialType } from '@nestjs/swagger';
import { CreateTargetSkillDto } from './create-target_skill.dto';

export class UpdateTargetSkillDto extends PartialType(CreateTargetSkillDto) {}
