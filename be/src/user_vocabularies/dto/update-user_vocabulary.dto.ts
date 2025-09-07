import { PartialType } from '@nestjs/mapped-types';
import { CreateUserVocabularyDto } from './create-user_vocabulary.dto';

export class UpdateUserVocabularyDto extends PartialType(CreateUserVocabularyDto) {}
