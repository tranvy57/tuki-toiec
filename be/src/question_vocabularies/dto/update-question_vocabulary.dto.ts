import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionVocabularyDto } from './create-question_vocabulary.dto';

export class UpdateQuestionVocabularyDto extends PartialType(CreateQuestionVocabularyDto) {}
