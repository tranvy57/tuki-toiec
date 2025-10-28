import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserVocabularyDto } from './dto/create-user_vocabulary.dto';
import { UpdateUserVocabularyDto } from './dto/update-user_vocabulary.dto';
import { UserVocabulary } from './entities/user_vocabulary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';
import { UserVocabularySession } from 'src/user_vocabulary_session/entities/user_vocabulary_session.entity';

interface TrackingOptions {
  source?: 'lesson' | 'search' | 'ai_recommendation' | 'import';
  correct?: boolean; // nếu dùng trong quiz / review
  incrementStrength?: boolean; // có muốn tăng strength không
  customDelta?: number; // độ thay đổi strength tùy theo case
  sourceLog?: 'practice' | 'lesson' | 'test'; // nguồn chi tiết hơn, ví dụ tên bài học
}

@Injectable()
export class UserVocabulariesService {
  constructor(
    @InjectRepository(UserVocabulary)
    private readonly userVocabRepo: Repository<UserVocabulary>,

    @InjectRepository(UserVocabularySession)
    private readonly sessionRepo: Repository<UserVocabularySession>,
  ) {}

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

    if (!record) throw new NotFoundException('UserVocabulary not found');

    record.isBookmarked = status;
    return await this.userVocabRepo.save(record);
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

    // ✅ Ghi session log
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
}
