import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UpdateStudyTaskDto {
  @IsOptional()
  @IsEnum(['pending', 'completed'])
  status?: 'pending' | 'completed';
}
