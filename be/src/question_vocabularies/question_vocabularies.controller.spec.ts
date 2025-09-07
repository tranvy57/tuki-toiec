import { Test, TestingModule } from '@nestjs/testing';
import { QuestionVocabulariesController } from './question_vocabularies.controller';
import { QuestionVocabulariesService } from './question_vocabularies.service';

describe('QuestionVocabulariesController', () => {
  let controller: QuestionVocabulariesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionVocabulariesController],
      providers: [QuestionVocabulariesService],
    }).compile();

    controller = module.get<QuestionVocabulariesController>(QuestionVocabulariesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
