import { Test, TestingModule } from '@nestjs/testing';
import { LessonItemController } from './lesson_item.controller';
import { LessonItemService } from './lesson_item.service';

describe('LessonItemController', () => {
  let controller: LessonItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonItemController],
      providers: [LessonItemService],
    }).compile();

    controller = module.get<LessonItemController>(LessonItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
