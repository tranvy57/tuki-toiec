import { PartialType } from '@nestjs/mapped-types';
import { CreateUserVocabularyDto } from './create-user_vocabulary.dto';
import { Expose, Type } from 'class-transformer';

export class UpdateUserVocabularyDto extends PartialType(
  CreateUserVocabularyDto,
) {}
