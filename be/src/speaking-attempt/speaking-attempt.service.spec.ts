import { Test, TestingModule } from '@nestjs/testing';
import { SpeakingAttemptService } from './speaking-attempt.service';

describe('SpeakingAttemptService', () => {
  let service: SpeakingAttemptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpeakingAttemptService],
    }).compile();

    service = module.get<SpeakingAttemptService>(SpeakingAttemptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
