import { Expose, Type } from 'class-transformer';
import { GroupDto } from 'src/group/dto/group.dto';
import { SkillDto } from 'src/skill/dto/skill.dto';

export class PartDto {
  @Expose()
  id: string;

  @Expose()
  partNumber: number;

  @Expose()
  direction: string;

  @Expose()
  @Type(() => GroupDto)
  groups: GroupDto[];

  @Expose()
  @Type(() => SkillDto)
  skills: SkillDto[];
}
