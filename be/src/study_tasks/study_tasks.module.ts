import { Module } from '@nestjs/common';
import { StudyTasksService } from './study_tasks.service';
import { StudyTasksController } from './study_tasks.controller';

@Module({
  controllers: [StudyTasksController],
  providers: [StudyTasksService],
  exports: [StudyTasksService],
})
export class StudyTasksModule {}
