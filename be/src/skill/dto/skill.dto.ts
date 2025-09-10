import { Expose } from "class-transformer";
import { BaseResponseDto } from "src/common/dto/base-response.dto";
import { QuestionTagDto } from 'src/question_tags/dto/question_tag.dto';

export class SkillDto extends BaseResponseDto {
    @Expose()
    id?: string;
    @Expose()
    name: string;
    @Expose()
    description?: string;
    @Expose()
    code: string;
    @Expose()
    QuestionTags?: QuestionTagDto[];
}