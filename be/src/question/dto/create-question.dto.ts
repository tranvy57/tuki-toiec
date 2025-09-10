import { BaseResponseDto } from "src/common/dto/base-response.dto";
import { QuestionTagDto } from "src/question_tags/dto/question_tag.dto";
import { QuestionVocabulariesDto } from "src/question_vocabularies/dto/question_vocabularies.dto";

export class CreateQuestionDto extends BaseResponseDto {
    id?: string;
    numberLabel: number;
    content: string;
    explanation?: string;
    score: number;
    questionTags?: QuestionTagDto[];
    questionVocabularies?: QuestionVocabulariesDto[];
}
