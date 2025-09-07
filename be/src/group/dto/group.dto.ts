import { Expose, Type } from 'class-transformer';
import { QuestionDto } from 'src/question/dto/question.dto';

export class GroupDto {
  @Expose()
  id: string;

  @Expose()
  orderIndex: number;

  @Expose()
  paragraphEn: string;

  @Expose()
  paragraphVn: string;

  @Expose()
  imageUrl?: string;

  @Expose()
  audioUrl?: string;

  @Expose()
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
