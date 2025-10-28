import { Module } from '@nestjs/common';
import { UserVocabularySessionService } from './user_vocabulary_session.service';
import { UserVocabularySessionController } from './user_vocabulary_session.controller';

@Module({
  controllers: [UserVocabularySessionController],
  providers: [UserVocabularySessionService],
})
export class UserVocabularySessionModule {}
