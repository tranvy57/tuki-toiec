import { Module } from '@nestjs/common';
import { QuestionTagsService } from './question_tags.service';
import { QuestionTagsController } from './question_tags.controller';

@Module({
  controllers: [QuestionTagsController],
  providers: [QuestionTagsService],
  exports: [QuestionTagsService],
})
export class QuestionTagsModule {}
