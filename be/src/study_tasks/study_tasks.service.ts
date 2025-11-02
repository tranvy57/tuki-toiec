import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudyTaskDto } from './dto/create-study_task.dto';
import { UpdateStudyTaskDto } from './dto/update-study_task.dto';
import { EntityManager, Repository } from 'typeorm';
import { StudyTask } from './entities/study_task.entity';
import { UserProgress } from 'src/user_progress/entities/user_progress.entity';
import { LessonSkill } from 'src/lesson_skills/entities/lesson_skill.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StudyTasksService {
  constructor(
    @Inject()
    private readonly manager: EntityManager,
    @InjectRepository(StudyTask)
    private readonly studyTaskRepo: Repository<StudyTask>,
  ) {}

  create(createStudyTaskDto: CreateStudyTaskDto) {
    return 'This action adds a new studyTask';
  }

  findAll() {
    return `This action returns all studyTasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studyTask`;
  }

  update(id: number, updateStudyTaskDto: UpdateStudyTaskDto) {
    return `This action updates a #${id} studyTask`;
  }

  remove(id: number) {
    return `This action removes a #${id} studyTask`;
  }

  async updateStudyTask(id: string, dto: UpdateStudyTaskDto) {
    const task = await this.studyTaskRepo.findOne({
      where: { id },
      relations: { lesson: true, plan: true },
    });

    if (!task) throw new NotFoundException('Study task not found');

    if (dto.status) task.status = dto.status;

    const updated = await this.studyTaskRepo.save(task);
    return updated;
  }

  async markSkippableStudyTasks(userId: string, threshold = 0.6) {
    const studyTaskRepo = this.manager.getRepository(StudyTask);
    const userProgressRepo = this.manager.getRepository(UserProgress);
    const lessonSkillRepo = this.manager.getRepository(LessonSkill);

    const progresses = await userProgressRepo.find({
      where: { user: { id: userId } },
      relations: ['skill'],
    });
    const profMap: Record<string, { prof: number; updatedAt?: Date }> = {};
    for (const p of progresses) {
      profMap[p.skill.id] = {
        prof: p.proficiency ?? 0,
        updatedAt: p.updatedAt,
      };
    }

    const tasks = await studyTaskRepo.find({
      where: { isActive: true, plan: { user: { id: userId } } },
      relations: { lesson: true },
    });

    const skippedTaskIds: string[] = [];

    const PROF_THRESHOLD = threshold;
    const LOGIT = (x: number) => 1 / (1 + Math.exp(-x));
    const COEFF = { alpha: 2.0, beta: 1.5, gamma: 1.0, bias: -2.0 }; 
    const RECENCY_TAU_DAYS = 30;
    const recencyScore = (d?: Date) => {
      if (!d) return 0.2; 
      const now = Date.now();
      const ageDays = Math.max(0, (now - d.getTime()) / (1000 * 60 * 60 * 24));
      return Math.exp(-ageDays / RECENCY_TAU_DAYS);
    };

    for (const task of tasks) {
      if (!task.lesson?.id) continue;

      const lessonSkills = await lessonSkillRepo.find({
        where: { lesson: { id: task.lesson.id } },
        relations: ['skill'],
      });
      if (!lessonSkills.length) continue;

      let weightedProfSum = 0;
      let weightedRecencySum = 0;
      let coveredWeightSum = 0;
      let totalWeight = 0;

      for (const ls of lessonSkills) {
        const weight = ls.weight ?? 1;
        const entry = profMap[ls.skill.id];
        const prof = entry?.prof ?? 0;
        const rec = recencyScore(entry?.updatedAt);

        totalWeight += weight;
        weightedProfSum += prof * weight;
        weightedRecencySum += rec * weight;
        if (prof >= PROF_THRESHOLD) coveredWeightSum += weight;
      }

      const avgProf = totalWeight > 0 ? weightedProfSum / totalWeight : 0;
      const avgRecency = totalWeight > 0 ? weightedRecencySum / totalWeight : 0;
      const coverage = totalWeight > 0 ? coveredWeightSum / totalWeight : 0;

      const z =
        COEFF.alpha * avgProf +
        COEFF.beta * coverage +
        COEFF.gamma * avgRecency +
        COEFF.bias;
      const pSkip = LOGIT(z);

      const COVERAGE_MIN = 0.6;
      const PSKIP_MIN = 0.5;

      if (coverage >= COVERAGE_MIN && pSkip >= PSKIP_MIN) {
        task.status = 'skipped';
        await studyTaskRepo.save(task);
        skippedTaskIds.push(task.id);
      }
    }

    return skippedTaskIds;
  }
}
