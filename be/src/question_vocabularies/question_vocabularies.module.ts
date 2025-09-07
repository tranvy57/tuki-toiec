import { Module } from '@nestjs/common';
import { QuestionVocabulariesService } from './question_vocabularies.service';
import { QuestionVocabulariesController } from './question_vocabularies.controller';

@Module({
  controllers: [QuestionVocabulariesController],
  providers: [QuestionVocabulariesService],
})
export class QuestionVocabulariesModule {}
