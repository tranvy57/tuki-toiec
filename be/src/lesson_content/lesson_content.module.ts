import { Module } from '@nestjs/common';
import { LessonContentService } from './lesson_content.service';
import { LessonContentController } from './lesson_content.controller';

@Module({
  controllers: [LessonContentController],
  providers: [LessonContentService],
})
export class LessonContentModule {}
