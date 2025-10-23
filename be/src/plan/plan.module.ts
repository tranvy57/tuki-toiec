import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Course } from 'src/courses/entities/course.entity';
import { StudyTask } from 'src/study_tasks/entities/study_task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, StudyTask, Course])],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
