import { Test, TestingModule } from '@nestjs/testing';
import { BlacklistedTokensController } from './blacklisted_tokens.controller';
import { BlacklistedTokensService } from './blacklisted_tokens.service';

describe('BlacklistedTokensController', () => {
  let controller: BlacklistedTokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlacklistedTokensController],
      providers: [BlacklistedTokensService],
    }).compile();

    controller = module.get<BlacklistedTokensController>(BlacklistedTokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
