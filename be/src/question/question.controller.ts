import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('testId') testId?: number,
    @Query('partId') partId?: number,
    @Query('groupId') groupId?: number,
    @Query('difficulty') difficulty?: number,
  ) {
    return this.questionService.findAll({
      page,
      limit,
      testId,
      partId,
      groupId,
      difficulty,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(id);
  }

  @Post('/create-with-tags/:id')
  async createWithTags(@Param('id') questionId: string) {
    return await this.questionService.createWithTags(questionId);
  }

  @Post('/sync-vocabs-questions')
  async syncVocabsToQuestions() {
    return await this.questionService.syncVocabsToQuestions();
  }

  // @Post('/sync-questions-skills')
  // updateQuestionSkills() {
  //   return this.questionService.updateQuestionSkills();
  // }
}