import { Injectable } from '@nestjs/common';
import { CreateUserProgressDto } from './dto/create-user_progress.dto';
import { UpdateUserProgressDto } from './dto/update-user_progress.dto';
import { UserProgress } from './entities/user_progress.entity';
import { EntityManager, In } from 'typeorm';

@Injectable()
export class UserProgressService {
  create(createUserProgressDto: CreateUserProgressDto) {
    return 'This action adds a new userProgress';
  }

  findAll() {
    return `This action returns all userProgress`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userProgress`;
  }

  update(id: number, updateUserProgressDto: UpdateUserProgressDto) {
    return `This action updates a #${id} userProgress`;
  }

  remove(id: number) {
    return `This action removes a #${id} userProgress`;
  }

  async updateUserProgress(
    manager: EntityManager,
    userId: string,
    skillMap: Record<string, { totalScore: number; totalDiff: number }>,
  ) {
    const repo = manager.getRepository(UserProgress);
    const existing = await repo.find({
      where: { user: { id: userId }, skill: { id: In(Object.keys(skillMap)) } },
      relations: ['user', 'skill'],
    });
    const progressMap = new Map(existing.map((up) => [up.skill.id, up]));

    const alpha = 0.2;
    const updates: UserProgress[] = [];

    for (const [skillId, { totalScore: s, totalDiff: d }] of Object.entries(
      skillMap,
    )) {
      const pLesson = d > 0 ? s / d : 0;
      const capped = Math.min(Math.max(pLesson, 0.15), 0.7);

      const up =
        progressMap.get(skillId) ??
        repo.create({
          user: { id: userId } as any,
          skill: { id: skillId } as any,
          proficiency: 0,
        });

      up.proficiency = progressMap.has(skillId)
        ? (1 - alpha) * up.proficiency + alpha * capped
        : capped;

      updates.push(up);
    }
    await repo.save(updates);
    return updates;
  }
}
