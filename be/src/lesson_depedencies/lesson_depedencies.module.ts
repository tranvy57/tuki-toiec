import { Module } from '@nestjs/common';
import { LessonDepedenciesService } from './lesson_depedencies.service';
import { LessonDepedenciesController } from './lesson_depedencies.controller';

@Module({
  controllers: [LessonDepedenciesController],
  providers: [LessonDepedenciesService],
  exports: [LessonDepedenciesService],
})
export class LessonDepedenciesModule {}
