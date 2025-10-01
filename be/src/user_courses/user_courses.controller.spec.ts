import { Test, TestingModule } from '@nestjs/testing';
import { UserCoursesController } from './user_courses.controller';
import { UserCoursesService } from './user_courses.service';

describe('UserCoursesController', () => {
  let controller: UserCoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCoursesController],
      providers: [UserCoursesService],
    }).compile();

    controller = module.get<UserCoursesController>(UserCoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
