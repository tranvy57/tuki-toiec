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

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, Test, Part, Question, Answer, Attempt]),
  ],
  controllers: [AttemptController],
  providers: [AttemptService],
})
export class AttemptModule {}
