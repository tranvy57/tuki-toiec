import { Expose } from 'class-transformer';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { QuestionDto } from 'src/question/dto/question.dto';
import { VocabularyDto } from 'src/vocabulary/dto/vocabulary.dto';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';

export class QuestionVocabulariesDto extends BaseResponseDto {
    @Expose()
    id?: string;
    @Expose()
    question?: QuestionDto;
    @Expose()
    vocabulary?: VocabularyDto;
    @Expose()
    isFocus?: boolean;
    @Expose()
    weight?: number;
}