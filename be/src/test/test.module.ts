import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TypeORMError } from 'typeorm/browser';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/question/entities/question.entity';
import { Answer } from 'src/answers/entities/answer.entity';
import { Part } from 'src/part/entities/part.entity';
import { Group } from 'src/group/entities/group.entity';
import { Test } from './entities/test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Test, Question, Answer, Part, Group])],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
