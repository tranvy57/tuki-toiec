import { Test, TestingModule } from '@nestjs/testing';
import { BlacklistedTokensService } from './blacklisted_tokens.service';

describe('BlacklistedTokensService', () => {
  let service: BlacklistedTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlacklistedTokensService],
    }).compile();

    service = module.get<BlacklistedTokensService>(BlacklistedTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
