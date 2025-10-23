import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { UserCourse } from 'src/user_courses/entities/user_course.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { StudyTask } from 'src/study_tasks/entities/study_task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, UserCourse, Plan, StudyTask])],

  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
