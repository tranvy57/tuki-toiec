import { PlanService } from './../plan/plan.service';
import {
  BadRequestException,
  Inject,
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
import { AttemptAnswerDto } from 'src/attempt_answers/dto/attempt_answer.dto';
import { CreateAttemptAnswerDto } from 'src/attempt_answers/dto/create-attempt_answer.dto';
import { AttemptAnswer } from 'src/attempt_answers/entities/attempt_answer.entity';
import { Answer } from 'src/answers/entities/answer.entity';
import { UserProgress } from 'src/user_progress/entities/user_progress.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { TargetSkill } from 'src/target_skills/entities/target_skill.entity';
import { UserVocabulary } from 'src/user_vocabularies/entities/user_vocabulary.entity';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';
import { UserProgressService } from 'src/user_progress/user_progress.service';
import { attempt } from 'joi';
import { QuestionDto } from 'src/question/dto/question.dto';
import { AttemptDto } from './dto/attempt.dto';
import { AttemptResultDto } from './dto/submit-attempt-response.dto';
import { StudyTasksService } from 'src/study_tasks/study_tasks.service';

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
    @InjectRepository(AttemptAnswer)
    private attemptAnswerRepo: Repository<AttemptAnswer>,
    @Inject()
    private readonly userProgressService: UserProgressService,
    @Inject()
    private readonly studyTaskService: StudyTasksService,
    @Inject()
    private readonly planService: PlanService,
    private dataSrc: DataSource,
  ) {}

  MAX_SCORE = 990;

  private toResponseDto(attempt: Attempt): AttemptDto {
    return plainToInstance(AttemptDto, attempt, {
      excludeExtraneousValues: true,
    });
  }

  private toQuestionDto(question: Question): QuestionDto {
    return plainToInstance(QuestionDto, question, {
      excludeExtraneousValues: true,
    });
  }

  private toAttemptAnswerDto(attempt: AttemptAnswer): AttemptAnswerDto {
    return plainToInstance(AttemptAnswerDto, attempt, {
      excludeExtraneousValues: true,
    });
  }

  async createAttempt(dto: CreateAttemptDto, user: User) {
    let idTest = dto.testId;
    if (dto.mode === 'review') {
      idTest = 'a1ebd8ec-3445-4334-9127-75c4ff3b12be';
    }

    console.log(idTest);

    const test = await this.testRepo.findOne({
      where: { id: idTest },
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
    if (attempt.mode == 'practice' || attempt.mode == 'review') {
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
        isCorrect:
          attempt.mode === 'practice' || attempt.mode === 'review'
            ? answer.isCorrect
            : null,
      });
    }

    const savedAttemptAnswer = await this.attemptAnswerRepo.save(attemptAnswer);
    return this.toAttemptAnswerDto(savedAttemptAnswer);
  }

  async submitAttempt(attemptId: string, user: User) {
    const [attempt, attemptAnswers] = await Promise.all([
      this.attemptRepo.findOne({
        where: { id: attemptId },
        relations: {
          user: true,
          parts: {
            groups: {
              questions: { answers: true, questionTags: { skill: true } },
            },
          },
        },
        order: { parts: { partNumber: 'ASC' } },
      }),

      this.attemptAnswerRepo.find({
        where: { attempt: { id: attemptId } },
        relations: {
          answer: true,
          question: true,
        },
      }),
    ]);

    if (!attempt) throw new NotFoundException('Attempt not found!');
    if (attempt.user.id !== user.id)
      throw new UnauthorizedException('You do not have permission!');

    const answerMap = new Map(attemptAnswers.map((aa) => [aa.question.id, aa]));

    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    let listeningScore = 0;
    let readingScore = 0;

    const updatedAttemptAnswers: AttemptAnswer[] = [];

    for (const part of attempt.parts) {
      for (const group of part.groups) {
        for (const question of group.questions as any[]) {
          const ans = answerMap.get(question.id);
          const score = Number(question.score ?? 1);

          let isCorrect: boolean | null = null;
          let userAnswerId: string | null = null;

          if (!ans || !ans.answer) {
            skippedCount++;
          } else {
            isCorrect = ans.answer.isCorrect;
            userAnswerId = ans.answer.id;
            if (ans.isCorrect !== isCorrect) {
              ans.isCorrect = isCorrect;
              updatedAttemptAnswers.push(ans);
            }

            if (isCorrect) {
              totalScore += score;
              correctCount++;
              if (part.partNumber <= 4) listeningScore += score;
              else readingScore += score;
            } else {
              wrongCount++;
            }
          }

          question.isCorrect = isCorrect;
          question.userAnswerId = userAnswerId;
        }
      }
    }

    if (updatedAttemptAnswers.length)
      await this.attemptAnswerRepo.save(updatedAttemptAnswers, { chunk: 500 });

    const totalQuestions = attempt.parts.reduce(
      (sum, p) => sum + p.groups.reduce((s2, g) => s2 + g.questions.length, 0),
      0,
    );
    const accuracy = totalQuestions > 0 ? correctCount / totalQuestions : 0;

    Object.assign(attempt, {
      status: 'submitted',
      finishAt: new Date(),
      totalScore,
    });

    await this.attemptRepo.save(attempt);

    const result = plainToInstance(
      AttemptResultDto,
      {
        id: attempt.id,
        mode: attempt.mode,
        status: attempt.status,
        startedAt: attempt.startedAt,
        finishAt: attempt.finishAt,
        totalScore,
        listeningScore,
        readingScore,
        totalQuestions,
        correctCount,
        wrongCount,
        skippedCount,
        accuracy,
        parts: attempt.parts,
      },
      { excludeExtraneousValues: true },
    );

    return result;
  }

  private evaluateAttempt(attempt: Attempt, attemptAnswers: AttemptAnswer[]) {
    const answerMap = new Map(
      attemptAnswers
        .filter((aa) => aa.question) // tránh undefined
        .map((aa) => [aa.question.id, aa]),
    );

    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    let totalQuestions = 0;

    let listeningScore = 0;
    let readingScore = 0;
    attempt.parts.forEach((p) =>
      p.groups.forEach((g) =>
        g.questions.forEach((q) => {
          if (!q) return; // tránh lỗi null

          totalQuestions += 1;
          const userAnswer = answerMap.get(q.id);
          q['userAnswer'] = userAnswer ?? null;

          const score = q['score'] ?? 1;

          if (!userAnswer) {
            skippedCount += 1;
            return;
          }

          if (userAnswer.answer?.isCorrect) {
            totalScore += score;
            correctCount += 1;

            if (p.partNumber <= 4) {
              listeningScore += score;
            } else {
              readingScore += score;
            }
          } else {
            wrongCount += 1;
          }
        }),
      ),
    );

    const accuracy = totalQuestions > 0 ? correctCount / totalQuestions : 0;

    return {
      parts: attempt.parts,
      listeningScore,
      readingScore,
      totalQuestions,
      correctCount,
      wrongCount,
      skippedCount,
      totalScore,
      accuracy,
    };
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

  async submitAttemptReview(attemptId: string, user: User) {
    return this.dataSrc.transaction(async (manager) => {
      const attempt = await this.loadAttempt(manager, attemptId, user);
      const answerMap = await this.loadAttemptAnswers(manager, attemptId);

      const { totalScore, correctCount, totalQuestions, skillMap, allKeys } =
        this.processQuestions(attempt, answerMap);

      // console.log('Skill map from processQuestions:', skillMap);
      await this.updateUserVocabulary(manager, user.id, allKeys, attempt);
      const updatedSkills = await this.userProgressService.updateUserProgress(
        manager,
        user.id,
        skillMap,
      );

      const skippedTasks = await this.studyTaskService.markSkippableStudyTasks(
        user.id,
        0.6,
      );

      await this.updateAttempt(manager, attempt, totalScore);

      const plan = await this.planService.getActivePlanByUserId(
        manager,
        user.id,
      );

      if (plan) {
        await this.planService.updatePlan(plan.id, 'in_progress');
      }

      return {
        attemptId: attempt.id,
        score: totalScore,
        correctCount,
        totalQuestions,
        updatedSkills: updatedSkills.map((u) => ({
          skillId: u.skillId,
          proficiency: u.proficiency,
        })),
        parts: attempt.parts,
        skippedTasks,
      };
    });
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
    const allKeys = new Set<string>();

    for (const part of attempt.parts) {
      for (const group of part.groups) {
        for (const q of group.questions) {
          totalQuestions++;
          const userAnswer = answerMap.get(q.id);
          q['userAnswer'] = userAnswer ?? null;

          const isCorrect = userAnswer?.answer?.isCorrect ?? false;
          const qScore = q['score'] ?? 1;
          const diff = q['difficulty'] ?? 1;

          if (isCorrect) {
            totalScore += qScore;
            correctCount++;
          }

          for (const tag of q.questionTags || []) {
            const skillId = tag.skill.id;
            const skillDiff = Number(tag.difficulty ?? 1);
            const score = isCorrect ? skillDiff : 0;

            if (!skillMap[skillId])
              skillMap[skillId] = { totalScore: 0, totalDiff: 0 };

            skillMap[skillId].totalScore += score;
            skillMap[skillId].totalDiff += skillDiff;
          }

          (q.lemmas || []).forEach((l) => allKeys.add(l));
          (q.phrases || []).forEach((p) => allKeys.add(p));
        }
      }
    }

    return { totalScore, correctCount, totalQuestions, skillMap, allKeys };
  }

  async updateUserVocabulary(
    manager: EntityManager,
    userId: string,
    lemmas: Set<string>,
    attempt: Attempt,
  ) {
    const uvRepo = manager.getRepository(UserVocabulary);
    const vocabRepo = manager.getRepository(Vocabulary);

    const lemmaArr = Array.from(lemmas);

    // 1. Lấy vocabularies match với các lemma/phrase đã detect
    const vocabs = await vocabRepo.find({
      where: { lemma: In(lemmaArr) },
      select: ['id', 'lemma', 'isPhrase'],
    });

    const vocabIdByKey = new Map(vocabs.map((v) => [v.lemma, v.id]));

    // 2. Lấy các UserVocabulary đã tồn tại
    const existing = await uvRepo.find({
      where: {
        user: { id: userId },
        vocabulary: { id: In([...vocabIdByKey.values()]) },
      },
      relations: ['user', 'vocabulary'],
    });

    const uvByKey = new Map<string, UserVocabulary>();
    for (const uv of existing) {
      uvByKey.set(uv.vocabulary.lemma, uv);
    }

    // 3. Tính toán update
    const updates: UserVocabulary[] = [];
    for (const key of lemmaArr) {
      const vocabId = vocabIdByKey.get(key);
      if (!vocabId) continue;

      let uv =
        uvByKey.get(key) ??
        uvRepo.create({
          user: { id: userId },
          vocabulary: { id: vocabId },
          wrongCount: 0,
          correctCount: 0,
          status: 'new',
        });

      // Tìm các câu hỏi trong attempt có chứa key này
      const relatedQuestions = attempt.parts.flatMap((p) =>
        p.groups.flatMap((g) =>
          g.questions.filter(
            (q) =>
              (!vocabs.find((v) => v.lemma === key)?.isPhrase &&
                q.lemmas?.includes(key)) ||
              (vocabs.find((v) => v.lemma === key)?.isPhrase &&
                q.phrases?.includes(key)),
          ),
        ),
      );

      for (const q of relatedQuestions) {
        const isCorrect = q['userAnswer']?.answer?.isCorrect ?? false;
        uv.correctCount += isCorrect ? 1 : 0;
        uv.wrongCount += isCorrect ? 0 : 1;
      }

      // Cập nhật status
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

  async updateAttempt(
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

  async loadAttemptAnswers(manager: EntityManager, attemptId: string) {
    const repo = manager.getRepository(AttemptAnswer);
    const attemptAnswers = await repo.find({
      where: { attempt: { id: attemptId } },
      relations: { answer: true, question: true },
    });
    return new Map(attemptAnswers.map((aa) => [aa.question.id, aa]));
  }

  async historyAttempt(user: User) {
    const attempts = await this.attemptRepo.find({
      // where: { user: { id: user.id } },
      relations: {
        user: true,
        test: true,
        parts: {
          groups: {
            questions: true,
          },
        },
      },
      order: { createdAt: 'DESC' },
    });

    console.log('attempt', attempts);

    if (!attempts.length) return [];

    const attemptIds = attempts.map((a) => a.id);
    const attemptAnswers = await this.attemptAnswerRepo.find({
      where: { attempt: { id: In(attemptIds) } },
      relations: { answer: true, question: true, attempt: true },
    });

    // Gom answer theo attemptId
    const answersByAttempt = new Map<string, AttemptAnswer[]>();
    attemptAnswers.forEach((aa) => {
      if (!answersByAttempt.has(aa.attempt.id)) {
        answersByAttempt.set(aa.attempt.id, []);
      }
      answersByAttempt.get(aa.attempt.id)!.push(aa);
    });

    return attempts.map((attempt) => {
      const answers = answersByAttempt.get(attempt.id) ?? [];
      const stats = this.evaluateAttempt(attempt, answers);
      return { ...attempt, ...stats };
    });
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
