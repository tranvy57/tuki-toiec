import { Injectable } from '@nestjs/common';
import { CreateQuestionVocabularyDto } from './dto/create-question_vocabulary.dto';
import { UpdateQuestionVocabularyDto } from './dto/update-question_vocabulary.dto';

@Injectable()
export class QuestionVocabulariesService {
  create(createQuestionVocabularyDto: CreateQuestionVocabularyDto) {
    return 'This action adds a new questionVocabulary';
  }

  findAll() {
    return `This action returns all questionVocabularies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} questionVocabulary`;
  }

  update(id: number, updateQuestionVocabularyDto: UpdateQuestionVocabularyDto) {
    return `This action updates a #${id} questionVocabulary`;
  }

  remove(id: number) {
    return `This action removes a #${id} questionVocabulary`;
  }
}
