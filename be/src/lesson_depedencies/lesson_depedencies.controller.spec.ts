import { Test, TestingModule } from '@nestjs/testing';
import { LessonDepedenciesController } from './lesson_depedencies.controller';
import { LessonDepedenciesService } from './lesson_depedencies.service';

describe('LessonDepedenciesController', () => {
  let controller: LessonDepedenciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonDepedenciesController],
      providers: [LessonDepedenciesService],
    }).compile();

    controller = module.get<LessonDepedenciesController>(LessonDepedenciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
