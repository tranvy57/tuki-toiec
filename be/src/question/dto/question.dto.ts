import { Expose, Type } from 'class-transformer';
import { AnswerDto } from 'src/answers/dto/answer.dto';
import { SkillDto } from 'src/skill/dto/skill.dto';

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
  @Type(() => SkillDto)
  skills?: SkillDto[];
}
