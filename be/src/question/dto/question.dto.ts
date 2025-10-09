import { Expose, Type } from 'class-transformer';
import { AnswerDto } from 'src/answers/dto/answer.dto';
import { QuestionTagDto } from 'src/question_tags/dto/question_tag.dto';

export class QuestionDto {
  @Expose()
  id: string;

  @Expose()
  numberLabel: number;

  @Expose()
  content: string;

  @Expose()
  score?: number;

  @Expose()
  explanation: string;

  @Expose()
  @Type(() => AnswerDto)
  answers?: AnswerDto[];

  @Expose()
  isCorrect?: boolean | null;

  @Expose()
  userAnswerId?: string | null;

  @Expose()
  partNumber?: number | null;

  @Expose()
  @Type(() => QuestionTagDto)
  questionTags?: QuestionTagDto[];
}
