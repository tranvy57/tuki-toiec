import { Test, TestingModule } from '@nestjs/testing';
import { UserVocabularySessionController } from './user_vocabulary_session.controller';
import { UserVocabularySessionService } from './user_vocabulary_session.service';

describe('UserVocabularySessionController', () => {
  let controller: UserVocabularySessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserVocabularySessionController],
      providers: [UserVocabularySessionService],
    }).compile();

    controller = module.get<UserVocabularySessionController>(UserVocabularySessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
