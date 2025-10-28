import { PartialType } from '@nestjs/swagger';
import { CreateUserVocabularySessionDto } from './create-user_vocabulary_session.dto';

export class UpdateUserVocabularySessionDto extends PartialType(CreateUserVocabularySessionDto) {}
