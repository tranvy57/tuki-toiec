import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { DataSource, Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { UserProgress } from 'src/user_progress/entities/user_progress.entity';
import { LessonSkill } from 'src/lesson_skills/entities/lesson_skill.entity';
import { LessonDependency } from 'src/lesson_depedencies/entities/lesson_depedency.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { StudyTask } from 'src/study_tasks/entities/study_task.entity';
import { PhaseLesson } from 'src/phase_lessons/entities/phase_lesson.entity';
import { Phase } from 'src/phase/entities/phase.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanDto } from './dto/plan.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PlanService {
  constructor(
    private readonly dataSrc: DataSource,
    @InjectRepository(Plan) private readonly planRepo: Repository<Plan>,
  ) {}

  private toDTO(plan: Plan): PlanDto {
    return plainToInstance(PlanDto, plan, {
      excludeExtraneousValues: true,
    });
  }

  async create(createPlanDto: CreatePlanDto, user: User) {
    const planRepo = this.dataSrc.getRepository(Plan);

    await planRepo.update(
      { user: { id: user.id }, isActive: true },
      { isActive: false },
    );

    const plan = planRepo.create({
      ...createPlanDto,
      user,
      isActive: true,
    });

    return planRepo.save(plan);
  }

  findAll() {
    return `This action returns all plan`;
  }

  async findOneActive(userId: string) {
    return this.dataSrc.getRepository(Plan).findOne({
      where: { user: { id: userId }, isActive: true },
    });
  }

  update(id: number, updatePlanDto: UpdatePlanDto) {
    return `This action updates a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }

  async planGenerator(userId: string) {
    return await this.dataSrc.transaction(async (manager) => {
      const userProgress = await manager.find(UserProgress, {
        where: { user: { id: userId } },
        relations: ['skill'],
      });
      const profBySkill = new Map(
        userProgress.map((p) => [p.skill.id, p.proficiency]),
      );
      const plan = await this.findOneActive(userId);
      if (!plan) throw new NotFoundException('Plan not found');

      let threshold = 0.7;
      if (plan.targetScore) threshold = plan.targetScore / 990;

      const weakSkills = userProgress
        .filter((p) => p.proficiency < threshold)
        .map((p) => p.skill.id);

      const lessonSkills = await manager.find(LessonSkill, {
        relations: ['lesson', 'skill'],
      });

      let candidateLessons = lessonSkills
        .filter((ls) => weakSkills.includes(ls.skill.id))
        .map((ls) => ls.lesson);

      candidateLessons = candidateLessons.filter(
        (l, i, arr) => arr.findIndex((x) => x.id === l.id) === i,
      );

      const deps = await manager.find(LessonDependency, {
        relations: ['lessonBefore', 'lesson'],
      });

      const filteredDeps = deps.filter((d) => {
        if (d.minProficiency == null) return true; // không có minProf → giữ
        const skillId = d.lessonBefore?.skills?.[0]?.skill?.id;
        const userProf = skillId ? (profBySkill.get(skillId) ?? 0) : 0;
        return userProf < d.minProficiency;
      });

      const lessonsWithDeps = await this.expandDependencies(
        candidateLessons,
        filteredDeps,
      );
      const sortedLessons = await this.topologicalSort(
        lessonsWithDeps,
        filteredDeps,
      );

      let phaseIndex = 1;
      const chunkSize = 5;
      for (let i = 0; i < sortedLessons.length; i += chunkSize) {
        const chunk = sortedLessons.slice(i, i + chunkSize);

        const phase = manager.create(Phase, {
          plan: { id: plan.id } as any,
          title: `Phase ${phaseIndex}`,
          order: phaseIndex++,
          status: 'active',
        });
        await manager.save(phase);

        for (const lesson of chunk) {
          const phaseLesson = manager.create(PhaseLesson, {
            phase: { id: phase.id } as any,
            lesson: { id: lesson.id } as any,
          });
          await manager.save(phaseLesson);

          const tasks = [
            manager.create(StudyTask, {
              plan: { id: plan.id } as any,
              lesson: { id: lesson.id } as any,
              mode: 'learn',
              status: 'pending',
            }),
            manager.create(StudyTask, {
              plan: { id: plan.id } as any,
              lesson: { id: lesson.id } as any,
              mode: 'review',
              status: 'pending',
            }),
          ];
          await manager.save(tasks);
        }
      }

      return plan;
    });
  }

  async expandDependencies(
    candidateLessons: Lesson[],
    deps: LessonDependency[],
  ) {
    const visited = new Map<string, Lesson>();

    const dfs = (lesson: Lesson) => {
      if (visited.has(lesson.id)) return;
      visited.set(lesson.id, lesson);

      const beforeDeps = deps.filter((d) => d.lesson.id === lesson.id);
      for (const d of beforeDeps) {
        dfs(d.lessonBefore);
      }
    };

    candidateLessons.forEach((l) => dfs(l));

    return Array.from(visited.values());
  }

  async topologicalSort(lessons: Lesson[], deps: LessonDependency[]) {
    const lessonMap = new Map(lessons.map((l) => [l.id, l]));

    const adj = new Map<string, string[]>();
    const indegree = new Map<string, number>();

    lessons.forEach((l) => {
      adj.set(l.id, []);
      indegree.set(l.id, 0);
    });

    for (const d of deps) {
      const beforeId = d.lessonBefore.id;
      const afterId = d.lesson.id;

      if (lessonMap.has(beforeId) && lessonMap.has(afterId)) {
        adj.get(beforeId)!.push(afterId);
        indegree.set(afterId, (indegree.get(afterId) || 0) + 1);
      }
    }

    const queue: string[] = [];
    indegree.forEach((deg, id) => {
      if (deg === 0) queue.push(id);
    });

    const result: Lesson[] = [];
    while (queue.length > 0) {
      const id = queue.shift()!;
      result.push(lessonMap.get(id)!);

      for (const next of adj.get(id) || []) {
        indegree.set(next, indegree.get(next)! - 1);
        if (indegree.get(next) === 0) {
          queue.push(next);
        }
      }
    }

    return result;
  }

  async getMyPlan(user: User) {
    const plan = await this.planRepo.findOne({
      where: { user: { id: user.id }, isActive: true },
      relations: { phases: true },
    });

    if (!plan) throw new NotFoundException('No active plan found for user');
    return this.toDTO(plan);
  }

}
