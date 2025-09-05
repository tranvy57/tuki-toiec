import { Expose, Type } from 'class-transformer';
import { AttemptAnswer } from 'src/attempt_answers/entities/attempt_answer.entity';
import { Part } from 'src/part/entities/part.entity';
import { TestDto } from 'src/test/dto/test.dto';

export class AttemptDto {
  @Expose()
  mode: 'practice' | 'test';
  @Expose()
  partIds: string[];
  @Expose()
  testId?: string;
  @Expose()
  @Expose()
  @Type(() => TestDto)
  test: TestDto;

  @Expose()
  startedAt?: Date;

  @Expose()
  finishAt?: Date;

  @Expose()
  totalScore: number;

  @Expose()
  status: 'in_progress' | 'submitted';

  @Expose()
  score?: number;
  @Expose()
  parts: Part[];
  @Expose()
  @Type(() => AttemptAnswer)
  attemptAnswers?: AttemptAnswer[];
}
