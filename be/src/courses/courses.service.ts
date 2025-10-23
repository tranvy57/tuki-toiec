import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { CourseDto } from './dto/course.dto';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserCourse,
  UserCourseStatus,
} from 'src/user_courses/entities/user_course.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { StudyTask } from 'src/study_tasks/entities/study_task.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(UserCourse)
    private readonly userCourseRepo: Repository<UserCourse>,
    @InjectRepository(Plan)
    private readonly planRepo: Repository<Plan>,
    @InjectRepository(StudyTask)
    private readonly studyTaskRepo: Repository<StudyTask>,
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
      where: [
        {
          user: { id: userId },
          status: UserCourseStatus.ACTIVE,
        },
        {
          user: { id: userId },
          status: UserCourseStatus.TRIAL,
        },
      ],
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

    const course = userCourse.course;

    // 2️⃣ Tìm plan đang active của user
    const plan = await this.planRepo.findOne({
      where: {
        user: { id: userId },
        isActive: true,
        course: { id: course.id },
      },
      relations: ['studyTasks', 'studyTasks.lesson'],
    });

    if (!plan) {
      // Nếu chưa có plan thì tất cả bài đều "locked"
      for (const phase of course.phases) {
        for (const pl of phase.phaseLessons) {
          pl.lesson['studyTaskStatus'] = 'locked';
        }
      }
      return course;
    }

    // 3️⃣ Tạo map lessonId -> status từ studyTasks
    const taskMap = new Map<string, string>();
    for (const task of plan.studyTasks) {
      taskMap.set(task.lesson.id, task.status);
    }

    // 4️⃣ Gắn trạng thái vào từng lesson
    for (const phase of course.phases) {
      for (const pl of phase.phaseLessons) {
        const lesson = pl.lesson;
        lesson['studyTaskStatus'] = taskMap.get(lesson.id) ?? 'locked';
      }
    }

    return course;
  }

  update(id: string, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
