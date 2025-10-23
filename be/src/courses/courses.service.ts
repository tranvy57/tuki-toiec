import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { CourseDto } from './dto/course.dto';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCourse, UserCourseStatus } from 'src/user_courses/entities/user_course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(UserCourse)
    private readonly userCourseRepo: Repository<UserCourse>,
  ) {}
  private toDTO(course: Course): CourseDto {
    return plainToInstance(CourseDto, course, {
      excludeExtraneousValues: true,
    });
  }
  private toListDTO(courses: Course[]): CourseDto[] {
    return plainToInstance(CourseDto, courses, {
      excludeExtraneousValues: true,
    });
  }
  create(createCourseDto: CreateCourseDto) {
    return 'This action adds a new course';
  }

  async findAll() {
    const courses = await this.courseRepo.find({
      relations: {
        phases: {
          phaseLessons: {
            lesson: true,
          },
        },
      },
      order: {
        price: 'ASC',
      },
    });

    return this.toListDTO(courses);
  }

  async findOne(id: string) {
    return await this.courseRepo.findOne({
      where: { id },
      relations: {
        phases: {
          phaseLessons: {
            lesson: {
              contents: true,
            },
          },
        },
      },
    });
  }

  async getCourseBuyeds(userId: string) {
    const userCourse = await this.userCourseRepo.findOne({
      where: {
        user: { id: userId },
        status: UserCourseStatus.ACTIVE,
      },
      relations: {
        course: {
          phases: {
            phaseLessons: {
              lesson: {
                contents: true,
              },
            },
          },
        },
      },
      order: { purchaseDate: 'DESC' },
    });

    if (!userCourse) {
      throw new NotFoundException('Người dùng chưa đăng ký khóa học nào.');
    }

    return userCourse.course;
  }

  update(id: string, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
