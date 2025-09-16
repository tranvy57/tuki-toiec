import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
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
import { UserProgress } from 'src/user_progress/entities/user_progress.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { TargetSkill } from 'src/target_skills/entities/target_skill.entity';
import { UserVocabulary } from 'src/user_vocabularies/entities/user_vocabulary.entity';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';

@Injectable()
export class AttemptService {
  constructor(
    @InjectRepository(Attempt) private attemptRepo: Repository<Attempt>,
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Test) private testRepo: Repository<Test>,
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
    @InjectRepository(Plan) private planRepo: Repository<Plan>,
    @InjectRepository(TargetSkill)
    private targetSkillRepo: Repository<TargetSkill>,
    @InjectRepository(UserProgress)
    private userProgressRepo: Repository<UserProgress>,
    @InjectRepository(UserVocabulary)
    private userVocabRepo: Repository<UserVocabulary>,
    @InjectRepository(AttemptAnswer)
    private attemptAnswerRepo: Repository<AttemptAnswer>,
    private dataSrc: DataSource,
  ) {}

  MAX_SCORE = 990;

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

    // console.log('attempt user ', attempt?.user);

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

    let attemptAnswer = await this.attemptAnswerRepo.findOne({
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
      attemptAnswer = this.attemptAnswerRepo.create({
        attempt,
        question: answer.question,
        answer,
        isCorrect: attempt.mode === 'practice' ? answer.isCorrect : null,
      });
    }

    const savedAttemptAnswer = await this.attemptAnswerRepo.save(attemptAnswer);
    return this.toAttemptAnswerDto(savedAttemptAnswer);
  }

  async saveAttemptAnswers(
    attemptId: string,
    dtos: CreateAttemptAnswerDto[], // mảng DTO
    user: User,
  ) {
    const attempt = await this.attemptRepo.findOne({
      where: { id: attemptId },
      relations: { user: true },
    });

    if (!attempt) throw new NotFoundException('Attempt not found!');
    if (attempt.user.id !== user.id)
      throw new UnauthorizedException(
        'You are not have permission to do this action!',
      );

    // load toàn bộ answers cần thiết 1 lần
    const answerIds = dtos.map((d) => d.answerId);
    const answers = await this.answerRepo.find({
      where: { id: In(answerIds) },
      relations: { question: true },
    });
    const answerMap = new Map(answers.map((a) => [a.id, a]));

    const updates: AttemptAnswer[] = [];

    for (const dto of dtos) {
      const answer = answerMap.get(dto.answerId);
      if (!answer)
        throw new NotFoundException(`Answer ${dto.answerId} not found!`);
      if (answer.question.id !== dto.questionId) {
        throw new BadRequestException(
          `Question and Answer not match for Q${dto.questionId}`,
        );
      }

      // kiểm tra đã có attemptAnswer cho câu hỏi này chưa
      let attemptAnswer = await this.attemptAnswerRepo.findOne({
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
        attemptAnswer = this.attemptAnswerRepo.create({
          attempt,
          question: answer.question,
          answer,
          isCorrect: attempt.mode === 'practice' ? answer.isCorrect : null,
        });
      }

      updates.push(attemptAnswer);
    }

    const saved = await this.attemptAnswerRepo.save(updates);
    return saved.map((aa) => this.toAttemptAnswerDto(aa));
  }

  async submitAttempt(attemptId: string, user: User) {
    let attempt = await this.attemptRepo.findOne({
      where: { id: attemptId },
      relations: {
        user: true,
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

    const attemptAnswers = await this.attemptAnswerRepo.find({
      where: { attempt: { id: attemptId } },
      relations: { answer: true, question: true },
    });

    const answerMap = new Map(attemptAnswers.map((aa) => [aa.question.id, aa]));

    if (!attempt) {
      throw new NotFoundException('Attempt not found!');
    }
    if (attempt?.user.id !== user.id)
      throw new UnauthorizedException(
        'You are not have permission to do this action!',
      );

    let totalScore = 0;
    let correctCount = 0;
    let totalQuestions = 0;

    attempt.parts.forEach((p) =>
      p.groups.forEach((g) =>
        g.questions.forEach((q) => {
          totalQuestions += 1;
          const userAnswer = answerMap.get(q.id);
          q['userAnswer'] = userAnswer ?? null;
          if (userAnswer?.answer?.isCorrect) {
            totalScore += q['score'] ?? 1;
            correctCount += 1;
          }
        }),
      ),
    );

    // for (const a of attemptAnswers) {
    //   if (a.isCorrect === true) totalScore += a.question.score;
    // }

    attempt.status = 'submitted';
    attempt.finishAt = new Date();
    attempt.totalScore = totalScore;

    const savedAttempt = await this.attemptRepo.save(attempt);

    return {
      ...savedAttempt,
      parts: attempt.parts,
      totalQuestions,
      correctCount,
      totalScore,
      // accuracy,
    };
  }

  async submitAttemptReview(attemptId: string, user: User) {
    return this.dataSrc.transaction(async (manager) => {
      const attempt = await this.loadAttempt(manager, attemptId, user);
      const answerMap = await this.loadAttemptAnswers(manager, attemptId);

      const { totalScore, correctCount, totalQuestions, skillMap, allLemmas } =
        this.processQuestions(attempt, answerMap);

      await this.updateUserVocabulary(manager, user.id, allLemmas, attempt);
      const updatedSkills = await this.updateUserProgress(
        manager,
        user.id,
        skillMap,
      );

      await this.updateAttempt(manager, attempt, totalScore);

      return {
        attemptId: attempt.id,
        score: totalScore,
        correctCount,
        totalQuestions,
        updatedSkills: updatedSkills.map((u) => ({
          skillId: u.skill.id,
          proficiency: u.proficiency,
        })),
        parts: attempt.parts,
      };
    });
  }

  async targetUserProficiency(user: User, userProgress: UserProgress[]) {
    const plan = await this.planRepo.findOne({
      where: { isActive: true, user: { id: user.id } },
      relations: { targetSkills: true },
    });

    if (!plan) throw new NotFoundException('No active plan found!');

    const targetProficiency = plan.targetScore
      ? plan.targetScore / this.MAX_SCORE
      : 0;

    const targets: TargetSkill[] = [];

    for (const up of userProgress) {
      const target = new TargetSkill();
      target.plan = plan;
      target.skill = up.skill;

      target.proficiency = targetProficiency;

      targets.push(target);
    }

    // Upsert theo cặp (planId, skillId) để không bị trùng
    await this.targetSkillRepo.upsert(targets, ['plan', 'skill']);
  }

  private async loadAttempt(
    manager: EntityManager,
    attemptId: string,
    user: User,
  ) {
    const repo = manager.getRepository(Attempt);
    const attempt = await repo.findOne({
      where: { id: attemptId },
      relations: {
        user: true,
        test: true,
        parts: {
          groups: {
            questions: {
              answers: true,
              questionTags: { skill: true },
            },
          },
        },
      },
    });
    if (!attempt) throw new NotFoundException('Attempt not found!');
    if (attempt.user.id !== user.id) throw new UnauthorizedException();
    return attempt;
  }

  private async loadAttemptAnswers(manager: EntityManager, attemptId: string) {
    const repo = manager.getRepository(AttemptAnswer);
    const attemptAnswers = await repo.find({
      where: { attempt: { id: attemptId } },
      relations: { answer: true, question: true },
    });
    return new Map(attemptAnswers.map((aa) => [aa.question.id, aa]));
  }

  private processQuestions(
    attempt: Attempt,
    answerMap: Map<string, AttemptAnswer>,
  ) {
    let totalScore = 0;
    let correctCount = 0;
    let totalQuestions = 0;

    const skillMap: Record<string, { totalScore: number; totalDiff: number }> =
      {};
    const allLemmas = new Set<string>();

    for (const part of attempt.parts) {
      for (const group of part.groups) {
        for (const q of group.questions) {
          totalQuestions++;
          const userAnswer = answerMap.get(q.id);
          q['userAnswer'] = userAnswer ?? null;

          const isCorrect = userAnswer?.answer?.isCorrect ?? false;
          if (isCorrect) {
            totalScore += q['score'] ?? 1;
            correctCount++;
          }

          for (const tag of q.questionTags || []) {
            const skillId = tag.skill.id;
            const diff = Number(tag.difficulty ?? 1);
            const score = isCorrect ? diff : 0;
            if (!skillMap[skillId])
              skillMap[skillId] = { totalScore: 0, totalDiff: 0 };
            skillMap[skillId].totalScore += score;
            skillMap[skillId].totalDiff += diff;
          }

          (q.lemmas || []).forEach((l) => allLemmas.add(l));
        }
      }
    }

    return { totalScore, correctCount, totalQuestions, skillMap, allLemmas };
  }

  private async updateUserVocabulary(
    manager: EntityManager,
    userId: string,
    lemmas: Set<string>,
    attempt: Attempt,
  ) {
    const uvRepo = manager.getRepository(UserVocabulary);
    const vocabRepo = manager.getRepository(Vocabulary);

    const lemmaArr = Array.from(lemmas);

    const vocabs = await vocabRepo.find({
      where: { lemma: In(lemmaArr) },
      select: ['id', 'lemma'],
    });
    const vocabIdByLemma = new Map(vocabs.map((v) => [v.lemma, v.id]));

    const existing = await uvRepo.find({
      where: {
        user: { id: userId },
        vocabulary: { id: In([...vocabIdByLemma.values()]) },
      },
      relations: ['user', 'vocabulary'],
    });
    const uvByLemma = new Map(existing.map((uv) => [uv.vocabulary.lemma, uv]));

    const updates: UserVocabulary[] = [];
    for (const lemma of lemmaArr) {
      const vocabId = vocabIdByLemma.get(lemma);
      if (!vocabId) {
        continue;
      }

      let uv =
        uvByLemma.get(lemma) ??
        uvRepo.create({
          user: { id: userId },
          vocabulary: { id: vocabId },
          wrongCount: 0,
          correctCount: 0,
          status: 'new',
        });

      const relatedQuestions = attempt.parts.flatMap((p) =>
        p.groups.flatMap((g) =>
          g.questions.filter((q) => q.lemmas?.includes(lemma)),
        ),
      );
      for (const q of relatedQuestions) {
        const isCorrect = q['userAnswer']?.answer?.isCorrect ?? false;
        uv.correctCount += isCorrect ? 1 : 0;
        uv.wrongCount += isCorrect ? 0 : 1;
      }

      if (uv.correctCount === 0) {
        uv.status = 'learning';
      } else if (uv.wrongCount === 0) {
        uv.status = 'mastered';
      } else {
        uv.status = 'review';
      }

      updates.push(uv);
    }

    await uvRepo.save(updates);
  }

  private async updateUserProgress(
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

  private async updateAttempt(
    manager: EntityManager,
    attempt: Attempt,
    totalScore: number,
  ) {
    const repo = manager.getRepository(Attempt);
    attempt.status = 'submitted';
    attempt.finishAt = new Date();
    attempt.totalScore = totalScore;
    await repo.save(attempt);
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

// enum VocabularyStatus {
//   NEW = 'new',
//   LEARNING = 'learning',
//   REVIEW = 'review',
//   MASTERED = 'mastered',
//   FORGOTTEN = 'forgotten',
//   DIFFICULT = 'difficult',
//   IGNORED = 'ignored',
// }
