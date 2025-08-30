import { Test, TestingModule } from '@nestjs/testing';
import { AttemptAnswersService } from './attempt_answers.service';

describe('AttemptAnswersService', () => {
  let service: AttemptAnswersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttemptAnswersService],
    }).compile();

    service = module.get<AttemptAnswersService>(AttemptAnswersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
