import { Expose, Type } from 'class-transformer';
import { AnswerDto } from 'src/answers/dto/answer.dto';
import { Answer } from 'src/answers/entities/answer.entity';
import { AttemptDto } from 'src/attempt/dto/attempt.dto';
import { QuestionDto } from 'src/question/dto/question.dto';
import { Question } from 'src/question/entities/question.entity';

export class AttemptAnswerDto {
  @Expose()
  id?: string;

  @Expose()
  @Type(() => AttemptDto)
  attempt: AttemptDto;

  @Expose()
  @Type(() => QuestionDto)
  question: Question;

  @Expose()
  @Type(() => AnswerDto)
  answer?: Answer | null;

  @Expose()
  isCorrect?: boolean;
}
