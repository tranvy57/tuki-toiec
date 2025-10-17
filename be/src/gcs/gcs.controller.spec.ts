import { Test, TestingModule } from '@nestjs/testing';
import { GcsController } from './gcs.controller';
import { GcsService } from './gcs.service';

describe('GcsController', () => {
  let controller: GcsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GcsController],
      providers: [GcsService],
    }).compile();

    controller = module.get<GcsController>(GcsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
