import { Module } from '@nestjs/common';
import { AttemptService } from './attempt.service';
import { AttemptController } from './attempt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from 'src/group/entities/group.entity';
import { Test } from 'src/test/entities/test.entity';
import { Part } from 'src/part/entities/part.entity';
import { Question } from 'src/question/entities/question.entity';
import { Answer } from 'src/answers/entities/answer.entity';
import { Attempt } from './entities/attempt.entity';
import { AttemptAnswer } from 'src/attempt_answers/entities/attempt_answer.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { TargetSkill } from 'src/target_skills/entities/target_skill.entity';
import { UserProgress } from 'src/user_progress/entities/user_progress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Group,
      Test,
      Part,
      Question,
      Answer,
      Attempt,
      AttemptAnswer,
      Plan,
      TargetSkill,
      UserProgress
    ]),
  ],
  controllers: [AttemptController],
  providers: [AttemptService],
})
export class AttemptModule {}
