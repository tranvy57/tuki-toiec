import { Test, TestingModule } from '@nestjs/testing';
import { LessonContentController } from './lesson_content.controller';
import { LessonContentService } from './lesson_content.service';

describe('LessonContentController', () => {
  let controller: LessonContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonContentController],
      providers: [LessonContentService],
    }).compile();

    controller = module.get<LessonContentController>(LessonContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
