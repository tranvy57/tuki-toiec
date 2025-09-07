import { Module } from '@nestjs/common';
import { UserVocabulariesService } from './user_vocabularies.service';
import { UserVocabulariesController } from './user_vocabularies.controller';

@Module({
  controllers: [UserVocabulariesController],
  providers: [UserVocabulariesService],
})
export class UserVocabulariesModule {}
