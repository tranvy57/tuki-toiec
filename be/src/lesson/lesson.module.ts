import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { LessonDepedenciesModule } from 'src/lesson_depedencies/lesson_depedencies.module';

@Module({
  imports: [LessonDepedenciesModule],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
