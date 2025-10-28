import { Module } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { UserVocabulariesModule } from 'src/user_vocabularies/user_vocabularies.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vocabulary]), UserVocabulariesModule],
  controllers: [VocabularyController],
  providers: [VocabularyService],
})
export class VocabularyModule {}
