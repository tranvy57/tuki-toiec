import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import { UserProgress } from 'src/user_progress/entities/user_progress.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanDto } from './dto/plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';
import { Course } from 'src/courses/entities/course.entity';
import { StudyTask } from 'src/study_tasks/entities/study_task.entity';

@Injectable()
export class PlanService {
  constructor(
    private readonly dataSrc: DataSource,
    @InjectRepository(Plan) private readonly planRepo: Repository<Plan>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(StudyTask)
    private readonly studyTaskRepo: Repository<StudyTask>,
  ) {}

  private toDTO(plan: Plan): PlanDto {
    return plainToInstance(PlanDto, plan, {
      excludeExtraneousValues: true,
    });
  }

  async create(createPlanDto: CreatePlanDto, user: User) {
    const { courseId, targetScore } = createPlanDto;

    return this.dataSrc.transaction(async (manager) => {
      const course = await this.courseRepo
        .createQueryBuilder('course')
        .leftJoinAndSelect('course.phases', 'phase')
        .leftJoinAndSelect('phase.phaseLessons', 'phaseLesson')
        .leftJoinAndSelect('phaseLesson.lesson', 'lesson')
        .leftJoinAndSelect('lesson.contents', 'content')
        .where('course.id = :id', { id: courseId })
        .orderBy('phase.order', 'ASC')
        .addOrderBy('phaseLesson.order', 'ASC')
        .addOrderBy('lesson.order', 'ASC')
        .addOrderBy('content.order', 'ASC')
        .getOne();

      if (!course) throw new NotFoundException('Course not found');

      await this.planRepo.update(
        { user: { id: user.id }, isActive: true },
        { isActive: false },
      );

      const plan = this.planRepo.create({
        user,
        course,
        targetScore,
        isActive: true,
        startDate: new Date().toISOString(),
        band: course.band,
        status: 'new',
      });
      const savedPlan = await this.planRepo.save(plan);

      const studyTasks: StudyTask[] = [];
      let isFirstTask = true;
      let order = 1;
      for (const phase of course.phases) {
        for (const pl of phase.phaseLessons) {
          for (const lc of pl.lesson.contents ?? []) {
            const task = this.studyTaskRepo.create({
              plan: savedPlan,
              lesson: pl.lesson,
              lessonContent: lc,
              order: order++,
              status: isFirstTask ? 'pending' : 'locked',
            });
            studyTasks.push(task);
            isFirstTask = false; 
          }
        }
      }

      if (studyTasks.length) {
        await this.studyTaskRepo.save(studyTasks);
      }

      // 5️⃣ Trả về kết quả
      return {
        ...savedPlan,
        totalTasks: studyTasks.length,
        courseName: course.title,
      };
    });
  }

  async updatePlan(
    planId: string,
    status: 'new' | 'in_progress' | 'completed' | 'paused',
  ) {
    const plan = await this.planRepo.findOne({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan not found');

    plan.status = status;
    await this.planRepo.save(plan);
  }

  async getActivePlanByUserId(
    manager: DataSource['manager'],
    userId: string,
  ): Promise<Plan | null> {
    const plan = await manager.getRepository(Plan).findOne({
      where: { user: { id: userId }, isActive: true },
    });
    return plan;
  }

  // async findUserPlans(user: User, courseId?: string) {
  //   const queryBuilder = this.planRepo
  //     .createQueryBuilder('plan')
  //     .leftJoinAndSelect('plan.phases', 'phases')
  //     .leftJoinAndSelect('phases.course', 'course')
  //     .where('plan.user_id = :userId', { userId: user.id })
  //     .orderBy('plan.createdAt', 'DESC');

  //   if (courseId) {
  //     queryBuilder.andWhere('phases.course_id = :courseId', { courseId });
  //   }

  //   const plans = await queryBuilder.getMany();

  //   return plans.map((plan) => ({
  //     ...this.toDTO(plan),
  //     status: this.getPlanStatus(plan),
  //   }));
  // }

  // async findOne(id: string, user: User) {
  //   const plan = await this.planRepo.findOne({
  //     where: { id, user: { id: user.id } },
  //     relations: {
  //       phases: {
  //         phaseLessons: {
  //           lesson: {
  //             studyTasks: true,
  //           },
  //         },
  //         course: true,
  //       },
  //     },
  //   });

  //   if (!plan) {
  //     throw new NotFoundException('Plan not found');
  //   }

  //   // Calculate current lesson and progress
  //   const currentLessonId = await this.getCurrentLessonId(plan);
  //   const progress = await this.calculateProgress(plan);

  //   return {
  //     ...this.toDTO(plan),
  //     currentLessonId,
  //     progress,
  //   };
  // }

  // async updateProgress(
  //   id: string,
  //   updateDto: { lessonId?: string; taskId?: string },
  //   user: User,
  // ) {
  //   const plan = await this.planRepo.findOne({
  //     where: { id, user: { id: user.id } },
  //     relations: { phases: { phaseLessons: true } },
  //   });

  //   if (!plan) {
  //     throw new NotFoundException('Plan not found');
  //   }

  //   // Update completion status
  //   if (updateDto.lessonId) {
  //     await this.markLessonCompleted(updateDto.lessonId, user.id);
  //   }

  //   if (updateDto.taskId) {
  //     await this.markTaskCompleted(updateDto.taskId, user.id);
  //   }

  //   // Update plan timestamp
  //   plan.updatedAt = new Date();
  //   await this.planRepo.save(plan);

  //   return this.getPlanSummary(id, user);
  // }

  // async getPlanSummary(id: string, user: User) {
  //   const plan = await this.planRepo.findOne({
  //     where: { id, user: { id: user.id } },
  //     relations: {
  //       phases: {
  //         phaseLessons: {
  //           lesson: {
  //             studyTasks: true,
  //           },
  //         },
  //         course: true,
  //       },
  //     },
  //   });

  //   if (!plan) {
  //     throw new NotFoundException('Plan not found');
  //   }

  //   const progress = await this.calculateProgress(plan);
  //   const timeRemaining = this.calculateRemainingTime(plan);

  //   return {
  //     planId: plan.id,
  //     courseName: plan.phases[0]?.course?.title || 'Unknown Course',
  //     startDate: plan.startDate,
  //     targetScore: plan.targetScore,
  //     totalDays: plan.totalDays,
  //     status: this.getPlanStatus(plan),
  //     completionPercentage: progress.completionPercentage,
  //     lessonsCompleted: progress.lessonsCompleted,
  //     totalLessons: progress.totalLessons,
  //     tasksCompleted: progress.tasksCompleted,
  //     totalTasks: progress.totalTasks,
  //     remainingDays: timeRemaining.days,
  //     estimatedHoursLeft: timeRemaining.hours,
  //     currentPhase: progress.currentPhase,
  //     nextMilestone: progress.nextMilestone,
  //   };
  // }

  // async update(id: string, updatePlanDto: UpdatePlanDto, user: User) {
  //   const plan = await this.planRepo.findOne({
  //     where: { id, user: { id: user.id } },
  //   });

  //   if (!plan) {
  //     throw new NotFoundException('Plan not found');
  //   }

  //   Object.assign(plan, updatePlanDto);
  //   plan.updatedAt = new Date();

  //   return this.planRepo.save(plan);
  // }

  // async remove(id: string, user: User) {
  //   const plan = await this.planRepo.findOne({
  //     where: { id, user: { id: user.id } },
  //   });

  //   if (!plan) {
  //     throw new NotFoundException('Plan not found');
  //   }

  //   await this.planRepo.remove(plan);
  //   return { message: 'Plan deleted successfully' };
  // }

  // // Helper methods
  // private getPlanStatus(plan: Plan): 'active' | 'completed' | 'expired' {
  //   const now = new Date();
  //   const startDate = new Date(plan.startDate || plan.createdAt);
  //   const endDate = plan.totalDays
  //     ? new Date(startDate.getTime() + plan.totalDays * 24 * 60 * 60 * 1000)
  //     : new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000); // Default 60 days

  //   // Check if all phases are completed
  //   const allPhasesCompleted = plan.phases.every(
  //     (phase) => phase.status === 'done',
  //   );
  //   if (allPhasesCompleted) return 'completed';

  //   if (now > endDate) return 'expired';
  //   return 'active';
  // }

  // private async getCurrentLessonId(plan: Plan): Promise<string | null> {
  //   // Find the first incomplete lesson in the plan
  //   for (const phase of plan.phases) {
  //     if (phase.status === 'active' || phase.status === 'locked') {
  //       for (const phaseLesson of phase.phaseLessons) {
  //         const isCompleted = await this.isLessonCompleted(
  //           phaseLesson.lesson.id,
  //           plan.user.id,
  //         );
  //         if (!isCompleted) {
  //           return phaseLesson.lesson.id;
  //         }
  //       }
  //     }
  //   }
  //   return null; // All lessons completed
  // }

  // private async calculateProgress(plan: Plan) {
  //   let totalLessons = 0;
  //   let lessonsCompleted = 0;
  //   let totalTasks = 0;
  //   let tasksCompleted = 0;
  //   let currentPhase: string | null = null;
  //   let nextMilestone: string | null = null;

  //   for (const phase of plan.phases) {
  //     let phaseCompleted = true;

  //     for (const phaseLesson of phase.phaseLessons) {
  //       totalLessons++;
  //       const lessonCompleted = await this.isLessonCompleted(
  //         phaseLesson.lesson.id,
  //         plan.user.id,
  //       );

  //       if (lessonCompleted) {
  //         lessonsCompleted++;
  //       } else {
  //         phaseCompleted = false;
  //         if (!currentPhase) {
  //           currentPhase = phase.title;
  //         }
  //       }

  //       // Count tasks
  //       if (phaseLesson.lesson.studyTasks) {
  //         totalTasks += phaseLesson.lesson.studyTasks.length;
  //         for (const task of phaseLesson.lesson.studyTasks) {
  //           const taskCompleted = await this.isTaskCompleted(
  //             task.id,
  //             plan.user.id,
  //           );
  //           if (taskCompleted) {
  //             tasksCompleted++;
  //           }
  //         }
  //       }
  //     }

  //     if (!nextMilestone && !phaseCompleted) {
  //       nextMilestone = `Complete ${phase.title}`;
  //     }
  //   }

  //   const completionPercentage =
  //     totalLessons > 0
  //       ? Math.round((lessonsCompleted / totalLessons) * 100)
  //       : 0;

  //   return {
  //     completionPercentage,
  //     lessonsCompleted,
  //     totalLessons,
  //     tasksCompleted,
  //     totalTasks,
  //     currentPhase,
  //     nextMilestone,
  //   };
  // }

  // private calculateRemainingTime(plan: Plan) {
  //   const now = new Date();
  //   const startDate = new Date(plan.startDate || plan.createdAt);
  //   const endDate = plan.totalDays
  //     ? new Date(startDate.getTime() + plan.totalDays * 24 * 60 * 60 * 1000)
  //     : new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000);

  //   const remainingMs = endDate.getTime() - now.getTime();
  //   const remainingDays = Math.max(
  //     0,
  //     Math.ceil(remainingMs / (24 * 60 * 60 * 1000)),
  //   );

  //   // Estimate hours based on remaining lessons (2 hours per lesson)
  //   const totalLessons = plan.phases.reduce(
  //     (total, phase) => total + phase.phaseLessons.length,
  //     0,
  //   );

  //   // Rough estimate: assume 80% completion for active plans
  //   const estimatedCompletedLessons = Math.floor(totalLessons * 0.2);
  //   const remainingLessons = totalLessons - estimatedCompletedLessons;
  //   const estimatedHours = remainingLessons * 2;

  //   return {
  //     days: remainingDays,
  //     hours: estimatedHours,
  //   };
  // }

  // private async isLessonCompleted(
  //   lessonId: string,
  //   userId: string,
  // ): Promise<boolean> {
  //   // Check if user has completed this lesson
  //   const userProgress = await this.dataSrc
  //     .getRepository(UserProgress)
  //     .findOne({
  //       where: {
  //         user: { id: userId },
  //         // Add lesson completion logic here based on your schema
  //       },
  //     });

  //   // Placeholder logic - adjust based on your completion tracking
  //   return false;
  // }

  // private async isTaskCompleted(
  //   taskId: string,
  //   userId: string,
  // ): Promise<boolean> {
  //   // Check if user has completed this task
  //   // Placeholder logic - adjust based on your completion tracking
  //   return false;
  // }

  // private async markLessonCompleted(lessonId: string, userId: string) {
  //   // Mark lesson as completed
  //   // Implement based on your completion tracking schema
  // }

  // private async markTaskCompleted(taskId: string, userId: string) {
  //   // Mark task as completed
  //   // Implement based on your completion tracking schema
  // }

  // Legacy method for backward compatibility
  async getMyPlan(user: User) {
    console.log('user', user);  
    const plan = await this.planRepo.findOne({
      where: { user: { id: user.id }, isActive: true },
    });

    console.log('plan', plan);

    if (!plan) throw new NotFoundException('No active plan found for user');
    return this.toDTO(plan);
  }
}
