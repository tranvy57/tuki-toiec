import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { PartDto } from 'src/part/dto/part.dto';

export class TestDto {
  @Expose()
  id?: string;
  @Expose()
  title: string;
  @Expose()
  audioUrl?: string;
  @Expose()
  @Type(() => PartDto)
  parts: PartDto[];
}
