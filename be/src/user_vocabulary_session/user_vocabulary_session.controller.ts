import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserVocabularySessionService } from './user_vocabulary_session.service';
import { CreateUserVocabularySessionDto } from './dto/create-user_vocabulary_session.dto';
import { UpdateUserVocabularySessionDto } from './dto/update-user_vocabulary_session.dto';

@Controller('user-vocabulary-session')
export class UserVocabularySessionController {
  constructor(private readonly userVocabularySessionService: UserVocabularySessionService) {}

  @Post()
  create(@Body() createUserVocabularySessionDto: CreateUserVocabularySessionDto) {
    return this.userVocabularySessionService.create(createUserVocabularySessionDto);
  }

  @Get()
  findAll() {
    return this.userVocabularySessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userVocabularySessionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserVocabularySessionDto: UpdateUserVocabularySessionDto) {
    return this.userVocabularySessionService.update(+id, updateUserVocabularySessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userVocabularySessionService.remove(+id);
  }
}
