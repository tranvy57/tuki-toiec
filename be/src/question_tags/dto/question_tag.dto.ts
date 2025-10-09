import { Expose, Type } from "class-transformer";
import { BaseResponseDto } from "src/common/dto/base-response.dto";
import { QuestionDto } from "src/question/dto/question.dto";
import { SkillDto } from "src/skill/dto/skill.dto";

export class QuestionTagDto extends BaseResponseDto {
    @Expose()
    id?: string;
    @Expose()
    question?: QuestionDto;
    @Expose()
    @Type(() => SkillDto)
    skill?: SkillDto;
    @Expose()
    difficulty?: number;
    @Expose()
    confidence?: number;
}