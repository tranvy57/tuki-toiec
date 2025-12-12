import { Module } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { UserVocabulariesModule } from 'src/user_vocabularies/user_vocabularies.module';
import { User } from 'src/user/entities/user.entity';
import { UserVocabulary } from 'src/user_vocabularies/entities/user_vocabulary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vocabulary, User, UserVocabulary]),
    UserVocabulariesModule,
  ],
  controllers: [VocabularyController],
  providers: [VocabularyService],
})
export class VocabularyModule {}
