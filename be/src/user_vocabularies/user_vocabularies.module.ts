import { Module } from '@nestjs/common';
import { UserVocabulariesService } from './user_vocabularies.service';
import { UserVocabulariesController } from './user_vocabularies.controller';
import { UserVocabulary } from './entities/user_vocabulary.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVocabularySession } from 'src/user_vocabulary_session/entities/user_vocabulary_session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserVocabulary, UserVocabularySession])],
  controllers: [UserVocabulariesController],
  providers: [UserVocabulariesService],
  exports: [UserVocabulariesService],
})
export class UserVocabulariesModule {}
