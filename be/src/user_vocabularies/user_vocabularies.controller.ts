import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserVocabulariesService } from './user_vocabularies.service';
import { CreateUserVocabularyDto } from './dto/create-user_vocabulary.dto';
import { UpdateUserVocabularyDto } from './dto/update-user_vocabulary.dto';

@Controller('user-vocabularies')
export class UserVocabulariesController {
  constructor(private readonly userVocabulariesService: UserVocabulariesService) {}

  @Post()
  create(@Body() createUserVocabularyDto: CreateUserVocabularyDto) {
    return this.userVocabulariesService.create(createUserVocabularyDto);
  }

  @Get()
  findAll() {
    return this.userVocabulariesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userVocabulariesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserVocabularyDto: UpdateUserVocabularyDto) {
    return this.userVocabulariesService.update(+id, updateUserVocabularyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userVocabulariesService.remove(+id);
  }
}
