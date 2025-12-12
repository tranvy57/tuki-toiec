import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudyTaskDto } from './dto/create-study_task.dto';
import { UpdateStudyTaskDto } from './dto/update-study_task.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { StudyTask } from './entities/study_task.entity';
import { UserProgress } from 'src/user_progress/entities/user_progress.entity';
import { LessonSkill } from 'src/lesson_skills/entities/lesson_skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from 'src/plan/entities/plan.entity';
import { UserCoursesService } from 'src/user_courses/user_courses.service';

@Injectable()
export class StudyTasksService {
  constructor(
    @Inject()
    private readonly manager: EntityManager,
    @InjectRepository(StudyTask)
    private readonly studyTaskRepo: Repository<StudyTask>,
    @InjectRepository(Plan)
    private readonly planRepo: Repository<Plan>,
    @Inject()
    private readonly dataSrc: DataSource,
    @Inject()
    private readonly userCoursesService: UserCoursesService,
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

  // giả định: StudyTask có quan hệ lesson, lessonContent; lesson.order & lessonContent.order tồn tại
  // và ta muốn đảm bảo TẠI MỌI THỜI ĐIỂM chỉ có 1 task `pending` cho chuỗi này (per plan).

  async completeStudyTask(taskId: string) {
    return await this.dataSrc.transaction(async (manager) => {
      const taskRepo = manager.withRepository(this.studyTaskRepo);
      const planRepo = manager.withRepository(this.planRepo);

      const current = await taskRepo.findOne({
        where: { id: taskId },
        relations: { plan: { user: true }, lesson: true, lessonContent: true },
      });
      if (!current) throw new NotFoundException('Study task not found');

      const plan = current.plan;

      if (current.status !== 'completed') {
        current.status = 'completed';
        await taskRepo.save(current);
      }

      const allTasks = await taskRepo
        .createQueryBuilder('t')
        .innerJoinAndSelect('t.lesson', 'lesson')
        .innerJoinAndSelect('t.lessonContent', 'content')
        .where('t.plan_id = :planId', { planId: plan.id })
        .orderBy('t.order', 'ASC')
        .getMany();

      const currentIdx = allTasks.findIndex((t) => t.id === current.id);

      // Check if user is premium
      const isPremium = await this.userCoursesService.isPremiumUser(
        plan.user.id,
      );

      const tasksToOpen: (typeof allTasks)[number][] = [];

      if (isPremium) {
        // Premium user: unlock only the next task (original behavior)
        for (let i = currentIdx + 1; i < allTasks.length; i++) {
          const t = allTasks[i];
          if (t.status === 'skipped') continue;
          if (t.status === 'locked' || t.status === 'pending') {
            tasksToOpen.push(t);
            break;
          }
        }
      } else {
        // Non-premium user: unlock premium task + 1 non-premium task
        let foundPremium = false;
        let foundNonPremium = false;

        for (let i = currentIdx + 1; i < allTasks.length; i++) {
          const t = allTasks[i];
          if (t.status === 'skipped') continue;
          if (t.status === 'locked' || t.status === 'pending') {
            const isPremiumContent = t.lessonContent?.isPremium ?? false;

            if (isPremiumContent && !foundPremium) {
              tasksToOpen.push(t);
              foundPremium = true;
            } else if (!isPremiumContent && !foundNonPremium) {
              tasksToOpen.push(t);
              foundNonPremium = true;
            }

            // Stop when we have both premium and non-premium
            if (foundPremium && foundNonPremium) break;
          }
        }
      }

      // Lock all other pending tasks except the ones we want to open
      const idsToOpen = new Set(tasksToOpen.map((t) => t.id));
      for (let i = currentIdx + 1; i < allTasks.length; i++) {
        if (
          allTasks[i].status === 'pending' &&
          !idsToOpen.has(allTasks[i].id)
        ) {
          allTasks[i].status = 'locked';
          await taskRepo.save(allTasks[i]);
        }
      }

      // Open the selected tasks
      for (const task of tasksToOpen) {
        task.status = 'pending';
        console.log(
          'Opening task:',
          task.id,
          'isPremium:',
          task.lessonContent?.isPremium,
        );
        await taskRepo.save(task);
      }

      const updatedTasks = await taskRepo.find({
        where: { plan: { id: plan.id } },
        select: ['id', 'status'],
      });

      const isPlanCompleted = updatedTasks.every(
        (t) => t.status === 'completed' || t.status === 'skipped',
      );

      if (isPlanCompleted && plan.status !== 'completed') {
        plan.status = 'completed';
        plan.completedAt = new Date().toISOString().split('T')[0];
        await planRepo.save(plan);
      }

      return {
        currentId: current.id,
        openedNextIds: tasksToOpen.map((t) => t.id),
        isPlanCompleted,
      };
    });
  }

  async markSkippableStudyTasks(userId: string, threshold = 0.52) {
    return this.markSkippableStudyTasksTx(this.manager, userId, threshold);
  }

  async markSkippableStudyTasksTx(
    manager: EntityManager,
    userId: string,
    threshold = 0.52,
  ) {
    const studyTaskRepo = manager.getRepository(StudyTask);
    const userProgressRepo = manager.getRepository(UserProgress);
    const lessonSkillRepo = manager.getRepository(LessonSkill);

    // Fetch user progresses via explicit FK to avoid relation where quirks
    const progresses = await userProgressRepo
      .createQueryBuilder('up')
      .leftJoinAndSelect('up.skill', 'skill')
      .where('up.user_id = :userId', { userId })
      .getMany();
    // Debug: show a compact snapshot of progresses found
    console.log(
      '[Skip] fetched progresses:',
      progresses.map((p) => ({ skillId: p.skill?.id, prof: p.proficiency })),
    );
    const profMap: Record<string, { prof: number; updatedAt?: Date }> = {};
    for (const p of progresses) {
      profMap[p.skill.id] = {
        prof: p.proficiency ?? 0,
        updatedAt: p.updatedAt,
      };
    }

    // Detect first review:
    // Case A: updatedAt is null (legacy)
    // Case B: updatedAt was set on creation (createdAt ~= updatedAt)
    const timestampFirstRun =
      progresses.length > 0 &&
      progresses.every((p) => {
        if (!p.updatedAt) return true;
        if (!p.createdAt) return false;
        const created = new Date(p.createdAt).getTime();
        const updated = new Date(p.updatedAt).getTime();
        const DIFF_MS = Math.abs(updated - created);
        return DIFF_MS <= 10 * 60 * 1000;
      });
    // Also treat as first-review if all skill proficiencies are already above threshold
    const proficiencyFirstRun =
      progresses.length > 0 &&
      progresses.every((p) => (p.proficiency ?? 0) >= threshold);
    const isFirstReview = timestampFirstRun || proficiencyFirstRun;
    console.log(
      `[Skip] isFirstReview=${isFirstReview} progresses=${progresses.length}`,
    );

    // FIX 1: Bỏ điều kiện isActive, chỉ lấy tasks chưa completed
    const tasks = await studyTaskRepo.find({
      where: { plan: { user: { id: userId } } },
      relations: { lesson: true },
    });

    const skippedTaskIds: string[] = [];

    const PROF_THRESHOLD = threshold;
    const LOGIT = (x: number) => 1 / (1 + Math.exp(-x));
    // FIX 2: Giảm bias để dễ skip hơn (từ -2.0 -> -1.0)
    const COEFF = { alpha: 2.0, beta: 1.5, gamma: 1.0, bias: -1.0 };
    const RECENCY_TAU_DAYS = 30;
    const recencyScore = (d?: Date) => {
      // FIX: Lần đầu (updatedAt = null) coi như mới cập nhật → recency = 1.0
      if (!d) return 1.0;
      const now = Date.now();
      const ageDays = Math.max(0, (now - d.getTime()) / (1000 * 60 * 60 * 24));
      return Math.exp(-ageDays / RECENCY_TAU_DAYS);
    };

    for (const task of tasks) {
      // FIX 3: Skip tasks đã completed hoặc đã skipped
      if (task.status === 'completed' || task.status === 'skipped') continue;
      if (!task.lesson?.id) continue;

      const lessonSkills = await lessonSkillRepo.find({
        where: { lesson: { id: task.lesson.id } },
        relations: ['skill'],
      });
      if (!lessonSkills.length) {
        // Fallback: if lesson has no skill mapping, use global user proficiency snapshot
        const globalTotal = progresses.length;
        const globalAvgProf =
          globalTotal > 0
            ? progresses.reduce((s, p) => s + (p.proficiency ?? 0), 0) /
              globalTotal
            : 0;
        const globalAboveCount = progresses.filter(
          (p) => (p.proficiency ?? 0) >= PROF_THRESHOLD,
        ).length;
        const globalCoverage =
          globalTotal > 0 ? globalAboveCount / globalTotal : 0;

        // Apply first-review fast-path on global snapshot
        if (isFirstReview) {
          const COVERAGE_MIN_FIRST = 0.7;
          if (globalCoverage >= COVERAGE_MIN_FIRST) {
            task.status = 'skipped';
            await studyTaskRepo.save(task);
            skippedTaskIds.push(task.id);
            continue;
          }
        }
        // Otherwise, evaluate normal gating on global snapshot
        const zGlobal =
          COEFF.alpha * globalAvgProf +
          COEFF.beta * globalCoverage +
          COEFF.gamma * 1.0 +
          COEFF.bias;
        const pSkipGlobal = LOGIT(zGlobal);
        const COVERAGE_MIN = 0.5;
        const PSKIP_MIN = 0.4;
        if (globalCoverage >= COVERAGE_MIN && pSkipGlobal >= PSKIP_MIN) {
          task.status = 'skipped';
          await studyTaskRepo.save(task);
          skippedTaskIds.push(task.id);
        }
        continue;
      }

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

      // First review fast-path: skip aggressively based on proficiency only
      if (isFirstReview) {
        const COVERAGE_MIN_FIRST = 0.7; // require 70% of lesson skills above threshold (easier)
        const ALL_SKILLS_ABOVE = lessonSkills.every(
          (ls) => (profMap[ls.skill.id]?.prof ?? 0) >= PROF_THRESHOLD,
        );
        console.log(
          `[Skip First] task=${task.id} lesson=${task.lesson.id} avgProf=${avgProf.toFixed(2)} coverage=${coverage.toFixed(2)} threshold=${PROF_THRESHOLD} allAbove=${ALL_SKILLS_ABOVE}`,
        );
        if (ALL_SKILLS_ABOVE || coverage >= COVERAGE_MIN_FIRST) {
          task.status = 'skipped';
          await studyTaskRepo.save(task);
          skippedTaskIds.push(task.id);
          console.log(
            `✅ [FirstReview] Skipped task ${task.id} (lesson: ${task.lesson.id}) - avgProf: ${avgProf.toFixed(2)}, coverage: ${coverage.toFixed(2)}`,
          );
          continue;
        }
      }

      // Normal path: logistic gating with relaxed thresholds
      const z =
        COEFF.alpha * avgProf +
        COEFF.beta * coverage +
        COEFF.gamma * avgRecency +
        COEFF.bias;
      const pSkip = LOGIT(z);

      const COVERAGE_MIN = 0.5;
      const PSKIP_MIN = 0.4;
      console.log(
        `[Skip Normal] task=${task.id} lesson=${task.lesson.id} avgProf=${avgProf.toFixed(2)} coverage=${coverage.toFixed(2)} pSkip=${pSkip.toFixed(2)}`,
      );

      if (coverage >= COVERAGE_MIN && pSkip >= PSKIP_MIN) {
        task.status = 'skipped';
        await studyTaskRepo.save(task);
        skippedTaskIds.push(task.id);
        console.log(
          `✅ Skipped task ${task.id} (lesson: ${task.lesson.id}) - avgProf: ${avgProf.toFixed(2)}, coverage: ${coverage.toFixed(2)}, pSkip: ${pSkip.toFixed(2)}`,
        );
      }
    }

    return skippedTaskIds;
  }
}
