import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/common/decorator/public.decorator';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('vocabularies')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post()
  async create(@Body() createVocabularyDto: CreateVocabularyDto) {
    return this.vocabularyService.create(createVocabularyDto);
  }

  @Get()
  @Public()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('partOfSpeech') partOfSpeech?: string,
  ) {
    if (search || type || partOfSpeech) {
      return this.vocabularyService.search({
        search,
        type,
        partOfSpeech,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 50,
      });
    }

    return this.vocabularyService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get('lookup')
  async lookup(@Query('word') word: string, @CurrentUser() user: User) {
    const result = await this.vocabularyService.lookupWord(word, user);
    return result;
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.vocabularyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVocabularyDto: UpdateVocabularyDto,
  ) {
    return this.vocabularyService.update(id, updateVocabularyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabularyService.remove(id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error('File not found!');
    return await this.vocabularyService.importFromExcel(file);
  }
}
