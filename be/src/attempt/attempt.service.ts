import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attempt } from './entities/attempt.entity';
import { Group } from 'src/group/entities/group.entity';
import { Question } from 'src/question/entities/question.entity';
import { Test } from 'src/test/entities/test.entity';
import { User } from 'src/user/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { AttemptDto } from './dto/attempt.dto';

@Injectable()
export class AttemptService {
  constructor(
    @InjectRepository(Attempt) private attemptRepo: Repository<Attempt>,
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Test) private testRepo: Repository<Test>,
  ) {}

  private toResponseDto(attempt: Attempt): AttemptDto {
    return plainToInstance(AttemptDto, attempt, {
      excludeExtraneousValues: true,
    });
  }

  async createAttempt(dto: CreateAttemptDto, user: User) {
    let selectedGroups = [];
    const test = await this.testRepo.findOne({ where: { id: dto.testId } });
    if (!test) throw new NotFoundException('Test was not found!');
    // // Tạo attempt mới
    const attempt = this.attemptRepo.create({
      user,
      mode: dto.mode,
      test: test,
      status: 'in_progress',
      startedAt: new Date(),
    });

    const saved = await this.attemptRepo.save(attempt);

    const savedAttempt = await this.attemptRepo.findOne({
      where: { id: saved.id },
      relations: {
        test: {
          parts: {
            groups: {
              questions: true,
            },
          },
        },
      },
    });

    console.log(savedAttempt);

    if (!savedAttempt) {
      throw new NotFoundException('Attempt was not found after saving!');
    }

    return this.toResponseDto(savedAttempt);
  }

  findAll() {
    return `This action returns all attempt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attempt`;
  }

  remove(id: number) {
    return `This action removes a #${id} attempt`;
  }
}
