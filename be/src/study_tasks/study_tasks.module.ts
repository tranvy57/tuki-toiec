import { Module } from '@nestjs/common';
import { StudyTasksService } from './study_tasks.service';
import { StudyTasksController } from './study_tasks.controller';
import { StudyTask } from './entities/study_task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from 'src/plan/entities/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudyTask, Plan])],
  controllers: [StudyTasksController],
  providers: [StudyTasksService],
  exports: [StudyTasksService],
})
export class StudyTasksModule {}
