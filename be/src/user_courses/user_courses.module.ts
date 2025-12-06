import { Module } from '@nestjs/common';
import { UserCoursesService } from './user_courses.service';
import { UserCoursesController } from './user_courses.controller';
import { UserCourse } from './entities/user_course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { PlanModule } from 'src/plan/plan.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserCourse, User]), PlanModule],
  controllers: [UserCoursesController],
  providers: [UserCoursesService],
  exports: [UserCoursesService],
})
export class UserCoursesModule { }
