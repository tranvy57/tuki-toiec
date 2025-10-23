import { Module } from '@nestjs/common';
import { UserCoursesService } from './user_courses.service';
import { UserCoursesController } from './user_courses.controller';
import { UserCourse } from './entities/user_course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { PlanService } from 'src/plan/plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserCourse, User]), PlanService],
  controllers: [UserCoursesController],
  providers: [UserCoursesService],
})
export class UserCoursesModule {}
