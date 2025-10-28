import { Test, TestingModule } from '@nestjs/testing';
import { UserVocabularySessionService } from './user_vocabulary_session.service';

describe('UserVocabularySessionService', () => {
  let service: UserVocabularySessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserVocabularySessionService],
    }).compile();

    service = module.get<UserVocabularySessionService>(UserVocabularySessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
