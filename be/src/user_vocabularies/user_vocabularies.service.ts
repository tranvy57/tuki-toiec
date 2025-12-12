import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserVocabularyDto } from './dto/create-user_vocabulary.dto';
import { UpdateUserVocabularyDto } from './dto/update-user_vocabulary.dto';
import { UserVocabulary } from './entities/user_vocabulary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';
import { UserVocabularySession } from 'src/user_vocabulary_session/entities/user_vocabulary_session.entity';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface TrackingOptions {
  source?: 'lesson' | 'search' | 'ai_recommendation' | 'import';
  correct?: boolean; // nếu dùng trong quiz / review
  incrementStrength?: boolean; // có muốn tăng strength không
  customDelta?: number; // độ thay đổi strength tùy theo case
  sourceLog?: 'practice' | 'lesson' | 'test'; // nguồn chi tiết hơn, ví dụ tên bài học
}

export interface ReviewItem {
  type: string;
  vocabId: string;
  content: any;
}

@Injectable()
export class UserVocabulariesService {
  private model: any;

  constructor(
    @InjectRepository(UserVocabulary)
    private readonly userVocabRepo: Repository<UserVocabulary>,

    @InjectRepository(UserVocabularySession)
    private readonly sessionRepo: Repository<UserVocabularySession>,

    @Inject()
    private readonly dataSource: DataSource,
  ) {
    const genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_GENAI_API_KEY || '',
    );
    this.model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json',
      },
    });
  }

  create(createUserVocabularyDto: CreateUserVocabularyDto) {
    return 'This action adds a new userVocabulary';
  }

  findAll() {
    return `This action returns all userVocabularies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userVocabulary`;
  }

  update(id: number, updateUserVocabularyDto: UpdateUserVocabularyDto) {
    return `This action updates a #${id} userVocabulary`;
  }

  remove(id: number) {
    return `This action removes a #${id} userVocabulary`;
  }

  async markAsImportant(vocabId: string, userId: string, status: boolean) {
    const record = await this.userVocabRepo.findOne({
      where: { vocabulary: { id: vocabId }, user: { id: userId } },
      relations: ['user'],
    });

    console.log('record', record);

    if (!record) {
      const saved = await this.track(userId, vocabId, { source: 'lesson' });

      saved.isBookmarked = status;
      return await this.userVocabRepo.save(saved);
    }

    console.log('delete', record);

    this.userVocabRepo.delete(record.id);
  }

  async track(userId: string, vocabId: string, options: TrackingOptions = {}) {
    const {
      source = 'lesson',
      correct,
      incrementStrength = true,
      customDelta,
      sourceLog,
    } = options;

    let userVocab = await this.userVocabRepo.findOne({
      where: { user: { id: userId }, vocabulary: { id: vocabId } },
    });

    let delta = 0;

    if (userVocab) {
      userVocab.timesReviewed++;
      userVocab.lastReviewedAt = new Date();

      if (typeof correct === 'boolean') {
        if (correct) userVocab.correctCount++;
        else userVocab.wrongCount++;
      }

      if (incrementStrength) {
        delta =
          typeof customDelta === 'number'
            ? customDelta
            : correct === false
              ? -0.05
              : 0.05;
        userVocab.strength = Math.min(
          1,
          Math.max(0, userVocab.strength + delta),
        );
      }

      userVocab.source = source;
    } else {
      userVocab = this.userVocabRepo.create({
        user: { id: userId } as User,
        vocabulary: { id: vocabId } as Vocabulary,
        source,
        strength: correct === false ? 0.05 : 0.1,
        learningStage: 'new',
        timesReviewed: 1,
        lastReviewedAt: new Date(),
        correctCount: correct ? 1 : 0,
        wrongCount: correct === false ? 1 : 0,
      });
    }

    await this.userVocabRepo.save(userVocab);

    const session = this.sessionRepo.create({
      userVocabulary: userVocab,
      correct,
      source: sourceLog,
      strengthBefore: userVocab.strength - delta,
      strengthAfter: userVocab.strength,
      reviewedAt: new Date(),
    });
    await this.sessionRepo.save(session);

    return userVocab;
  }

  async createItems(vocabularies: Vocabulary[]) {
    const items: ReviewItem[] = [];

    for (const v of vocabularies) {
      const rand = Math.random();

      // if (rand < 0.2) {
      //   const mcq = await this.createMCQ(v);
      //   if (mcq) items.push(mcq)
      //   else items.push(this.createCloze(v));
      // } else if (rand < 0.6) items.push(this.createPronunciation(v));
      // else items.push(this.createCloze(v));
      items.push(this.createCloze(v));
    }

    return items;
  }

  async selectReviewList(userId: string, limit = 100) {
    const qb = this.dataSource
      .getRepository(UserVocabulary)
      .createQueryBuilder('uv')
      .leftJoinAndSelect('uv.vocabulary', 'v')
      .where('uv.user_id = :userId', { userId })
      .andWhere('uv.learningStage IN (:...stages)', {
        stages: ['new', 'learning', 'forgotten'],
      })
      .andWhere('(uv.next_review_at IS NULL OR uv.next_review_at <= NOW())')
      .orderBy('uv.strength', 'ASC')
      .limit(limit);

    return qb.getMany();
  }

  async updateAfterReview(userId: string, vocabId: string, isCorrect: boolean) {
    const repo = this.dataSource.getRepository(UserVocabulary);

    let record = await repo.findOne({
      where: { user: { id: userId }, vocabulary: { id: vocabId } },
    });

    if (!record) {
      record = repo.create({
        user: { id: userId } as User,
        vocabulary: { id: vocabId } as Vocabulary,
        source: 'lesson',
        strength: 0,
        learningStage: 'new',
        timesReviewed: 0,
        correctCount: 0,
        wrongCount: 0,
        lastReviewedAt: new Date(),
      });
    }

    record.timesReviewed += 1;
    if (isCorrect) record.correctCount += 1;
    else record.wrongCount += 1;

    record.correctRate = record.correctCount / record.timesReviewed;

    const delta = isCorrect ? 0.1 : -0.15;
    record.strength = Math.min(Math.max(record.strength + delta, 0), 1);

    const prevStage = record.learningStage;

    if (record.timesReviewed === 0) {
      record.learningStage = 'new';
    } else if (record.strength >= 0.7) {
      record.learningStage = 'mastered';
    } else if (record.strength < 0.3 && prevStage === 'mastered') {
      record.learningStage = 'forgotten';
    } else {
      record.learningStage = 'learning';
    }

    const now = new Date();
    record.lastReviewedAt = now;

    let intervalDays = 1;
    if (record.strength > 0.8) intervalDays = 7;
    else if (record.strength > 0.5) intervalDays = 3;
    else if (record.strength > 0.2) intervalDays = 1;
    else intervalDays = 0.5;

    record.nextReviewAt = new Date(now.getTime() + intervalDays * 86400000);

    await repo.save(record);

    await this.dataSource.getRepository(UserVocabularySession).save({
      userVocabulary: record,
      isCorrect,
      reviewedAt: now,
      reviewType: 'review',
    });

    return record;
  }

  private async generateDistractors(vocab: Vocabulary): Promise<string[]> {
    const prompt = `
  Từ: "${vocab.word}" (${vocab.partOfSpeech})
  Nghĩa đúng: "${vocab.meaning}"

  Hãy tạo 3 lựa chọn sai bằng tiếng Việt, cùng loại từ và cùng chủ đề, 
  nhưng không trùng nghĩa đúng. 
  Trả về mảng JSON hợp lệ, ví dụ: ["ăn", "ngủ", "nhảy"]
  `;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text().trim();

      const jsonText = text.match(/\[.*\]/s)?.[0] ?? '[]';
      let arr = JSON.parse(jsonText);

      if (
        arr.length === 1 &&
        typeof arr[0] === 'string' &&
        arr[0].includes(',')
      ) {
        arr = arr[0]
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
      }

      return arr;
    } catch (err: any) {
      const msg = err.message || '';
      console.error('Error generating distractors:', msg);
    }

    return [];
  }

  async createMCQ(vocab: Vocabulary) {
    const distractors = await this.generateDistractors(vocab);

    if (!distractors || distractors.length < 3) return null;

    const rawChoices = [...distractors.slice(0, 3), vocab.meaning].sort(
      () => Math.random() - 0.5,
    );

    const letterKeys = ['A', 'B', 'C', 'D'];
    const choices = rawChoices.map((value, idx) => ({
      key: letterKeys[idx],
      value,
    }));

    const correctKey =
      choices.find((c) => c.value === vocab.meaning)?.key ?? 'A';

    return {
      type: 'mcq',
      vocabId: vocab.id,
      content: {
        question: `What is the meaning of "${vocab.word}"?`,
        choices,
        correctKey,
        audioUrl: vocab.audioUrl,
      },
    };
  }

  createCloze(vocab: Vocabulary) {
    const text_base = vocab.exampleEn?.split('b.')[0].trim();
    const text = text_base.replace(new RegExp(vocab.word, 'gi'), '_____');
    return {
      type: 'cloze',
      vocabId: vocab.id,
      content: { text, answer: vocab.word, ...vocab },
    };
  }

  createPronunciation(vocab: Vocabulary) {
    return {
      type: 'pronunciation',
      vocabId: vocab.id,
      content: { vocab },
    };
  }
}
