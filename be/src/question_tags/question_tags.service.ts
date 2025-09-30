import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionTagDto } from './dto/create-question_tag.dto';
import { UpdateQuestionTagDto } from './dto/update-question_tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionTag } from './entities/question_tag.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Question } from 'src/question/entities/question.entity';
import { QuestionTagDto } from './dto/question_tag.dto';
import { BASE_CEFR, CEFR_TO_DIFFICULTY } from 'src/common/constant/skill.constant';

@Injectable()
export class QuestionTagsService {
  constructor(private readonly dataSrc: DataSource) {}
  create(createQuestionTagDto: CreateQuestionTagDto) {
    return 'This action adds a new questionTag';
  }

  findAll() {
    return `This action returns all questionTags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} questionTag`;
  }

  update(id: number, updateQuestionTagDto: UpdateQuestionTagDto) {
    return `This action updates a #${id} questionTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} questionTag`;
  }
}
