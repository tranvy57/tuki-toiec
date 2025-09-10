import { Expose, Type } from 'class-transformer';
import { GroupDto } from 'src/group/dto/group.dto';

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
}
