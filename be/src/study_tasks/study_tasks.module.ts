import { Module } from '@nestjs/common';
import { StudyTasksService } from './study_tasks.service';
import { StudyTasksController } from './study_tasks.controller';
import { StudyTask } from './entities/study_task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StudyTask])],
  controllers: [StudyTasksController],
  providers: [StudyTasksService],
  exports: [StudyTasksService],
})
export class StudyTasksModule {}
