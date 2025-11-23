import { map } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from 'src/skill/entities/skill.entity';
import { QuestionTagsService } from 'src/question_tags/question_tags.service';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepo: Repository<Skill>,
    @InjectRepository(Question)
    private questionsRepo: Repository<Question>,
    @InjectRepository(Vocabulary)
    private vocabRepo: Repository<Vocabulary>,
    @Inject()
    private readonly questionTagsService: QuestionTagsService,
    private dataSrc: DataSource,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const question = this.questionsRepo.create(createQuestionDto);
    return this.questionsRepo.save(question);
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    testId?: number;
    partId?: number;
    groupId?: number;
    difficulty?: number;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const qb = this.questionsRepo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.group', 'group')
      .leftJoinAndSelect('group.part', 'part')
      .leftJoinAndSelect('part.test', 'test')
      .leftJoinAndSelect('q.answers', 'answers')
      .leftJoinAndSelect('q.grammars', 'grammars')
      .leftJoinAndSelect('q.vocabularies', 'vocabularies')
      .leftJoinAndSelect('q.questionTags', 'questionTags');

    // FILTERS
    if (query.testId) {
      qb.andWhere('test.id = :testId', { testId: query.testId });
    }

    if (query.partId) {
      qb.andWhere('part.id = :partId', { partId: query.partId });
    }

    if (query.groupId) {
      qb.andWhere('group.id = :groupId', { groupId: query.groupId });
    }

    // Nếu difficulty nằm ở PART
    if (query.difficulty) {
      qb.andWhere('part.difficulty = :difficulty', {
        difficulty: query.difficulty,
      });
    }

    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.questionsRepo.findOne({ where: { id } });
  }

  // UPDATE
  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    await this.questionsRepo.update(id, updateQuestionDto);
    return this.findOne(id);
  }

  // REMOVE
  async remove(id: string) {
    const found = await this.findOne(id);
    await this.questionsRepo.delete(id);
    return { deleted: true, previous: found };
  }

  async createWithTags(questionId: string) {
    const question = await this.questionsRepo.findOne({
      where: { id: questionId },
      relations: ['group', 'group.part'],
    });
    const skills = await this.skillsRepo.find();
    // if (question) {
    //   return this.questionTagsService.addTagToQuestion(question, skills);
    // }
  }
  async syncVocabsToQuestions(): Promise<void> {
    const questions = await this.questionsRepo.find();
    const vocabs = await this.vocabRepo.find();

    const pairs: { questionId: string; vocabId: string }[] = [];

    for (const q of questions) {
      for (const v of vocabs) {
        if (
          (!v.isPhrase && q.lemmas?.includes(v.lemma)) ||
          (v.isPhrase && q.phrases?.includes(v.lemma))
        ) {
          pairs.push({ questionId: q.id, vocabId: v.id });
        }
      }
    }
    if (pairs.length > 0) {
      await this.dataSrc
        .createQueryBuilder()
        .insert()
        .into('question_vocabularies')
        .values(
          pairs.map((p) => ({
            question_id: p.questionId,
            vocabulary_id: p.vocabId,
          })),
        )
        .orIgnore()
        .execute();
    }
  }
}

