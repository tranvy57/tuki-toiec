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

  create(createQuestionDto: CreateQuestionDto) {
    return 'This action adds a new question';
  }

  findAll() {
    return `This action returns all question`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
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

