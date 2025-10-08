import { Expose, Type } from 'class-transformer';
import { AttemptAnswer } from 'src/attempt_answers/entities/attempt_answer.entity';
import { PartDto } from 'src/part/dto/part.dto';
import { Part } from 'src/part/entities/part.entity';
import { TestDto } from 'src/test/dto/test.dto';

export class AttemptDto {
  @Expose()
  id: string;

  @Expose()
  mode: 'practice' | 'test';

  @Expose()
  @Type(() => TestDto)
  test: TestDto;

  @Expose()
  startedAt: Date;

  @Expose()
  finishAt: Date;

  @Expose()
  totalScore: number;

  @Expose()
  listeningScore: number;

  @Expose()
  readingScore: number;

  @Expose()
  correctCount: number;

  @Expose()
  wrongCount: number;

  @Expose()
  skippedCount: number;

  @Expose()
  accuracy: number;

  @Expose()
  status: 'in_progress' | 'submitted';
}
