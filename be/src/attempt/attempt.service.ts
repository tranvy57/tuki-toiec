import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { UpdateAttemptDto } from './dto/update-attempt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attempt } from './entities/attempt.entity';
import { Group } from 'src/group/entities/group.entity';
import { Question } from 'src/question/entities/question.entity';
import { Test } from 'src/test/entities/test.entity';

@Injectable()
export class AttemptService {
  constructor(
    @InjectRepository(Attempt) private attemptRepo: Repository<Attempt>,
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Test) private testRepo: Repository<Test>,
  ) {}

  // async createAttempt(userId: string, dto: CreateAttemptDto) {
  //   let selectedGroups = [];
  //   let questions = [];

  //   // Tạo attempt mới
  //   const attempt = this.attemptRepo.create({
  //     userId,
  //     mode: dto.mode,
  //     partIds: dto.mode === 'practice' ? JSON.stringify(dto.partIds) : null,
  //     testId: dto.mode === 'exam' ? dto.testId : null,
  //     status: 'doing',
  //     startedAt: new Date(),
  //   });
  //   await this.attemptRepo.save(attempt);

  //   // Gom group theo part (hoặc test)
  //   const groupsByPart: Record<string, any[]> = {};
  //   if (dto.mode === 'practice') {
  //     dto.partIds.forEach((partId) => {
  //       groupsByPart[partId] = selectedGroups
  //         .filter((g) => g.partId === partId)
  //         .map((g) => ({
  //           groupId: g.groupId,
  //           audioUrl: g.audioUrl,
  //           imageUrl: g.imageUrl,
  //           paragraphEn: g.paragraphEn,
  //           questions: questions.filter((q) => q.groupId === g.groupId),
  //         }));
  //     });
  //   } else if (dto.mode === 'exam') {
  //     // Nếu muốn gom group theo part trong 1 test, bạn join thêm part table
  //     // Hoặc đơn giản trả về list group/part luôn
  //     selectedGroups.forEach((g) => {
  //       const partId = g.partId;
  //       if (!groupsByPart[partId]) groupsByPart[partId] = [];
  //       groupsByPart[partId].push({
  //         groupId: g.groupId,
  //         audioUrl: g.audioUrl,
  //         imageUrl: g.imageUrl,
  //         paragraphEn: g.paragraphEn,
  //         questions: questions.filter((q) => q.groupId === g.groupId),
  //       });
  //     });
  //   }

  //   // Trả về response chung
  //   return {
  //     attemptId: attempt.attemptId,
  //     mode: dto.mode,
  //     parts: Object.keys(groupsByPart).map((partId) => ({
  //       partId,
  //       groups: groupsByPart[partId],
  //     })),
  //   };
  // }

  findAll() {
    return `This action returns all attempt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attempt`;
  }

  update(id: number, updateAttemptDto: UpdateAttemptDto) {
    return `This action updates a #${id} attempt`;
  }

  remove(id: number) {
    return `This action removes a #${id} attempt`;
  }
}
