import { Test, TestingModule } from '@nestjs/testing';
import { UserProgressController } from './user_progress.controller';
import { UserProgressService } from './user_progress.service';

describe('UserProgressController', () => {
  let controller: UserProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProgressController],
      providers: [UserProgressService],
    }).compile();

    controller = module.get<UserProgressController>(UserProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
