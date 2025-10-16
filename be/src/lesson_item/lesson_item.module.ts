import { Module } from '@nestjs/common';
import { LessonItemService } from './lesson_item.service';
import { LessonItemController } from './lesson_item.controller';

@Module({
  controllers: [LessonItemController],
  providers: [LessonItemService],
})
export class LessonItemModule {}
