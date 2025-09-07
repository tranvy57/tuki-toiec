import { Test, TestingModule } from '@nestjs/testing';
import { QuestionVocabulariesService } from './question_vocabularies.service';

describe('QuestionVocabulariesService', () => {
  let service: QuestionVocabulariesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionVocabulariesService],
    }).compile();

    service = module.get<QuestionVocabulariesService>(QuestionVocabulariesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
