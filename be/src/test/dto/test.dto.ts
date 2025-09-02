import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { PartDto } from 'src/part/dto/part.dto';

export class TestDto extends BaseResponseDto {
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
