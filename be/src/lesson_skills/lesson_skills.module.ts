import { Module } from '@nestjs/common';
import { LessonSkillsService } from './lesson_skills.service';
import { LessonSkillsController } from './lesson_skills.controller';

@Module({
  controllers: [LessonSkillsController],
  providers: [LessonSkillsService],
})
export class LessonSkillsModule {}
