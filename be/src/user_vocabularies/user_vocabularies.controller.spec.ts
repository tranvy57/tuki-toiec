import { Test, TestingModule } from '@nestjs/testing';
import { UserVocabulariesController } from './user_vocabularies.controller';
import { UserVocabulariesService } from './user_vocabularies.service';

describe('UserVocabulariesController', () => {
  let controller: UserVocabulariesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserVocabulariesController],
      providers: [UserVocabulariesService],
    }).compile();

    controller = module.get<UserVocabulariesController>(UserVocabulariesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
