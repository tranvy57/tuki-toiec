import { Test, TestingModule } from '@nestjs/testing';
import { PhaseLessonsController } from './phase_lessons.controller';
import { PhaseLessonsService } from './phase_lessons.service';

describe('PhaseLessonsController', () => {
  let controller: PhaseLessonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhaseLessonsController],
      providers: [PhaseLessonsService],
    }).compile();

    controller = module.get<PhaseLessonsController>(PhaseLessonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
