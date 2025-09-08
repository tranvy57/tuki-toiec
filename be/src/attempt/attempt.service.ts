import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
import { AttemptAnswerDto } from 'src/attempt_answers/dto/attempt_answer.dto';
import { CreateAttemptAnswerDto } from 'src/attempt_answers/dto/create-attempt_answer.dto';
import { AttemptAnswer } from 'src/attempt_answers/entities/attempt_answer.entity';
import { Answer } from 'src/answers/entities/answer.entity';

@Injectable()
export class AttemptService {
  constructor(
    @InjectRepository(Attempt) private attemptRepo: Repository<Attempt>,
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Test) private testRepo: Repository<Test>,
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
    @InjectRepository(AttemptAnswer)
    private attemptAnserRepo: Repository<AttemptAnswer>,
  ) {}

  private toResponseDto(attempt: Attempt): AttemptDto {
    return plainToInstance(AttemptDto, attempt, {
      excludeExtraneousValues: true,
    });
  }

  private toAttemptAnswerDto(attempt: AttemptAnswer): AttemptAnswerDto {
    return plainToInstance(AttemptAnswerDto, attempt, {
      excludeExtraneousValues: true,
    });
  }

  async createAttempt(dto: CreateAttemptDto, user: User) {
    const test = await this.testRepo.findOne({
      where: { id: dto.testId },
      relations: {
        parts: {
          groups: {
            questions: {
              answers: true,
            },
          },
        },
      },
    });
    if (!test) throw new NotFoundException('Test was not found!');

    let selectedParts = test.parts;

    console.log(selectedParts);

    if (dto.mode === 'practice') {
      if (!dto.partIds || dto.partIds.length === 0) {
        throw new BadRequestException(
          'Must select at least one part for practice',
        );
      }

      selectedParts = test.parts.filter((p) => dto.partIds.includes(p.id));
      if (selectedParts.length === 0) {
        throw new BadRequestException('No valid parts selected for practice');
      }
    }

    console.log('User create attempt ', user);

    // Tạo attempt mới
    const attempt = this.attemptRepo.create({
      user,
      mode: dto.mode,
      test: test,
      status: 'in_progress',
      startedAt: new Date(),
      parts: selectedParts,
    });

    const saved = await this.attemptRepo.save(attempt);

    const savedAttempt = await this.attemptRepo.findOne({
      where: { id: saved.id },
      relations: {
        test: true,
        parts: {
          groups: {
            questions: {
              answers: true,
            },
          },
        },
      },
    });

    if (!savedAttempt) {
      throw new NotFoundException('Attempt was not found after saving!');
    }

    return this.toResponseDto(savedAttempt);
  }

  async saveAttemptAnswer(
    attemptId: string,
    dto: CreateAttemptAnswerDto,
    user: User,
  ) {
    const attempt = await this.attemptRepo.findOne({
      where: { id: attemptId },
      relations: {
        user: true,
      },
    });

    console.log('attempt user ', attempt?.user);

    if (!attempt) {
      throw new NotFoundException('Attempt not found!');
    }
    if (attempt?.user.id !== user.id)
      throw new UnauthorizedException(
        'You are not have permission to do this action!',
      );

    const answer = await this.answerRepo.findOne({
      where: { id: dto.answerId },
      relations: {
        question: true,
      },
    });

    if (!answer) throw new NotFoundException('Answer not found!');
    if (answer.question.id !== dto.questionId)
      throw new BadRequestException('Question and Answer not match!');

    let isCorrect: boolean | null = null;
    if (attempt.mode == 'practice') {
      isCorrect = answer.isCorrect;
    }

    let attemptAnswer = await this.attemptAnserRepo.findOne({
      where: {
        attempt: { id: attempt.id },
        question: { id: dto.questionId },
      },
      relations: ['question', 'answer'],
    });

    if (attemptAnswer) {
      attemptAnswer.answer = answer;
      attemptAnswer.isCorrect =
        attempt.mode === 'practice' ? answer.isCorrect : null;
    } else {
      attemptAnswer = this.attemptAnserRepo.create({
        attempt,
        question: answer.question,
        answer,
        isCorrect: attempt.mode === 'practice' ? answer.isCorrect : null,
      });
    }

    const savedAttemptAnswer = await this.attemptAnserRepo.save(attemptAnswer);
    return this.toAttemptAnswerDto(savedAttemptAnswer);
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
