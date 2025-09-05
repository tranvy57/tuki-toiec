import { Expose, Type } from 'class-transformer';
import { AnswerDto } from 'src/answers/dto/answer.dto';

export class QuestionDto {
  @Expose()
  id: string;

  @Expose()
  numberLabel: number;

  @Expose()
  content: string;

  @Expose()
  explanation: string;

  @Expose()
  @Type(() => AnswerDto)
  answers?: AnswerDto[];
}
