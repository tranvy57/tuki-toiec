import { Injectable } from '@nestjs/common';
import { CreateUserCourseDto } from './dto/create-user_course.dto';
import { UpdateUserCourseDto } from './dto/update-user_course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCourse, UserCourseStatus } from './entities/user_course.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class UserCoursesService {
  constructor(
    @InjectRepository(UserCourse)
    private readonly userCourseRepo: Repository<UserCourse>,
  ) {}
  create(createUserCourseDto: CreateUserCourseDto) {
    return 'This action adds a new userCourse';
  }

  findAll() {
    return `This action returns all userCourses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userCourse`;
  }

  update(id: number, updateUserCourseDto: UpdateUserCourseDto) {
    return `This action updates a #${id} userCourse`;
  }

  remove(id: number) {
    return `This action removes a #${id} userCourse`;
  }

  async isPremiumUser(userId: string): Promise<boolean> {
    const now = new Date();

    const activeCourse = await this.userCourseRepo.findOne({
      where: [
        {
          user: { id: userId },
          status: UserCourseStatus.ACTIVE,
          expireDate: MoreThan(now),
        },
        {
          user: { id: userId },
          status: UserCourseStatus.TRIAL,
          expireDate: MoreThan(now),
        }
      ],
    });

    return !!activeCourse;
  }
}
