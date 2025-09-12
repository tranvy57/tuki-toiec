import { Inject, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from 'src/skill/entities/skill.entity';
import { QuestionTagsService } from 'src/question_tags/question_tags.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepo: Repository<Skill>,
    @InjectRepository(Question)
    private questionsRepo: Repository<Question>,
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
    if (question){
      return this.questionTagsService.addTagToQuestion(question, skills);
    }
  }

  async updateQuestionSkills() {
    const query = `
          INSERT INTO question_vocabularies (question_id, vocabulary_id)
          SELECT q.id, v.id
          FROM questions q
          JOIN vocabularies v
            ON v.lemma = ANY(q.lemmas)
          WHERE NOT EXISTS (
            SELECT 1 FROM question_vocabularies qv
            WHERE qv.question_id = q.id AND qv.vocabulary_id = v.id
          )
        `;
    const result = await this.dataSrc.query(query);
    return { message: 'Synced question_vocabularies' };
  }
}