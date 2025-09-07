import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionVocabulariesService } from './question_vocabularies.service';
import { CreateQuestionVocabularyDto } from './dto/create-question_vocabulary.dto';
import { UpdateQuestionVocabularyDto } from './dto/update-question_vocabulary.dto';

@Controller('question-vocabularies')
export class QuestionVocabulariesController {
  constructor(private readonly questionVocabulariesService: QuestionVocabulariesService) {}

  @Post()
  create(@Body() createQuestionVocabularyDto: CreateQuestionVocabularyDto) {
    return this.questionVocabulariesService.create(createQuestionVocabularyDto);
  }

  @Get()
  findAll() {
    return this.questionVocabulariesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionVocabulariesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionVocabularyDto: UpdateQuestionVocabularyDto) {
    return this.questionVocabulariesService.update(+id, updateQuestionVocabularyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionVocabulariesService.remove(+id);
  }
}
