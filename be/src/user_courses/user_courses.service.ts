import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserCourseDto } from './dto/create-user_course.dto';
import { UpdateUserCourseDto } from './dto/update-user_course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCourse, UserCourseStatus } from './entities/user_course.entity';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { CourseBand } from 'src/courses/consts';
import { User } from 'src/user/entities/user.entity';
import { PlanService } from 'src/plan/plan.service';

@Injectable()
export class UserCoursesService {
  constructor(
    @InjectRepository(UserCourse)
    private readonly userCourseRepo: Repository<UserCourse>,

    @Inject()
    private readonly dataSource: DataSource,

    @Inject()
    private readonly planService: PlanService
  ) {}
  async create(user: User, band: CourseBand): Promise<UserCourse> {
    return await this.dataSource.transaction(async (manager) => {
      // 1️⃣ Tìm course phù hợp band
      const course = await manager.getRepository(Course).findOne({
        where: { band },
      });
      if (!course) {
        throw new NotFoundException(`Không tìm thấy khóa học cho band ${band}`);
      }

      // 2️⃣ Kiểm tra nếu user đã có trial course (tránh tạo trùng)
      const existing = await manager.getRepository(UserCourse).findOne({
        where: {
          user: { id: user.id },
          course: { id: course.id },
          status: UserCourseStatus.TRIAL,
        },
      });

      if (existing) {
        return existing; // đã có trial thì không tạo lại
      }

      // 3️⃣ Tạo user_course trial
      const trialCourse = manager.getRepository(UserCourse).create({
        user: { id: user.id } as any,
        course,
        status: UserCourseStatus.TRIAL,
        purchaseDate: new Date(),
      });

      const savedTrial = await manager
        .getRepository(UserCourse)
        .save(trialCourse);

      // 4️⃣ Tạo Plan tương ứng (nếu muốn user có thể học thử)
      this.planService.create({
        courseId: course.id,
        targetScore: band
      }, user)

     

      return savedTrial;
    });
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
      ],
    });

    return !!activeCourse;
  }
}
