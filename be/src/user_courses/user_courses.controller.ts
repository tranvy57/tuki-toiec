import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserCoursesService } from './user_courses.service';
import { CreateUserCourseDto } from './dto/create-user_course.dto';
import { UpdateUserCourseDto } from './dto/update-user_course.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CourseBand } from 'src/courses/consts';

@Controller('user-courses')
export class UserCoursesController {
  constructor(private readonly userCoursesService: UserCoursesService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() body: CreateUserCourseDto) {
    return this.userCoursesService.create(
      user,
      body.band,
    );
  }

  @Get()
  findAll() {
    return this.userCoursesService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCoursesService.remove(+id);
  }

  @Get('is-premium')
  async isPremiumUser(
    @CurrentUser() user: User,
  ): Promise<{ isPremium: boolean }> {
    const isPremium = await this.userCoursesService.isPremiumUser(user.id);
    return { isPremium };
  }
}
