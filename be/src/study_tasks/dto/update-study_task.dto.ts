import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UpdateStudyTaskDto {
  @IsOptional()
  @IsEnum(['pending', 'in_progress', 'completed'])
  status?: 'pending' | 'in_progress' | 'completed';
}
