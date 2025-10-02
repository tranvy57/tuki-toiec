import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { CourseDto } from './dto/course.dto';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
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
    });
    return this.toListDTO(courses);
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
