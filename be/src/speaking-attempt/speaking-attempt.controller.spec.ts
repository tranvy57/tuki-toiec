import { Test, TestingModule } from '@nestjs/testing';
import { SpeakingAttemptController } from './speaking-attempt.controller';
import { SpeakingAttemptService } from './speaking-attempt.service';

describe('SpeakingAttemptController', () => {
  let controller: SpeakingAttemptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeakingAttemptController],
      providers: [SpeakingAttemptService],
    }).compile();

    controller = module.get<SpeakingAttemptController>(SpeakingAttemptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
