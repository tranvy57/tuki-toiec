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

    // 1️⃣ Lấy proficiency hiện tại của user
    const progresses = await userProgressRepo.find({
      where: { user: { id: userId } },
      relations: ['skill'],
    });
    const profMap = Object.fromEntries(
      progresses.map((p) => [p.skill.id, p.proficiency]),
    );

    // 2️⃣ Lấy tất cả study_task có lesson
    const tasks = await studyTaskRepo.find({
      where: { isActive: true, plan: { user: { id: userId } } },
      relations: { lesson: true },
    });

    const skippedTaskIds: string[] = [];

    for (const task of tasks) {
      if (!task.lesson?.id) continue;

      const lessonSkills = await lessonSkillRepo.find({
        where: { lesson: { id: task.lesson.id } },
        relations: ['skill'],
      });
      if (!lessonSkills.length) continue;

      let weightedSum = 0;
      let totalWeight = 0;
      for (const ls of lessonSkills) {
        const prof = profMap[ls.skill.id] ?? 0;
        const weight = ls.weight ?? 1;
        weightedSum += prof * weight;
        totalWeight += weight;
      }
      const avgScore = totalWeight > 0 ? weightedSum / totalWeight : 0;

      // 5️⃣ Skip nếu proficiency đủ cao
      if (avgScore >= threshold) {
        task.status = 'skipped';
        await studyTaskRepo.save(task);
        skippedTaskIds.push(task.id);
      }
    }

    return skippedTaskIds;
  }
}
