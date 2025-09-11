import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from 'src/skill/entities/skill.entity';
import { QuestionTag } from 'src/question_tags/entities/question_tag.entity';
import { Question } from './entities/question.entity';
import { QuestionTagsModule } from 'src/question_tags/question_tags.module';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, QuestionTag, Question]), QuestionTagsModule],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
