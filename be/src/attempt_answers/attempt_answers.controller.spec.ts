import { Test, TestingModule } from '@nestjs/testing';
import { AttemptAnswersController } from './attempt_answers.controller';
import { AttemptAnswersService } from './attempt_answers.service';

describe('AttemptAnswersController', () => {
  let controller: AttemptAnswersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttemptAnswersController],
      providers: [AttemptAnswersService],
    }).compile();

    controller = module.get<AttemptAnswersController>(AttemptAnswersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
