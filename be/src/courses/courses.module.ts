import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { UserCourse } from 'src/user_courses/entities/user_course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, UserCourse])],

  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
