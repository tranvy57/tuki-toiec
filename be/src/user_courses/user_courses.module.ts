import { Module } from '@nestjs/common';
import { UserCoursesService } from './user_courses.service';
import { UserCoursesController } from './user_courses.controller';

@Module({
  controllers: [UserCoursesController],
  providers: [UserCoursesService],
})
export class UserCoursesModule {}
