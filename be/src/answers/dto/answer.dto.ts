import { Expose } from 'class-transformer';

export class AnswerDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  isCorrect: boolean;

  @Expose()
  answerKey: string;
}
