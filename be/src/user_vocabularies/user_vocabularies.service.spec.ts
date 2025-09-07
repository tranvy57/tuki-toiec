import { Test, TestingModule } from '@nestjs/testing';
import { UserVocabulariesService } from './user_vocabularies.service';

describe('UserVocabulariesService', () => {
  let service: UserVocabulariesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserVocabulariesService],
    }).compile();

    service = module.get<UserVocabulariesService>(UserVocabulariesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
