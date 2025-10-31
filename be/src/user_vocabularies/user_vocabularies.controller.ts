import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserVocabulariesService } from './user_vocabularies.service';
import { CreateUserVocabularyDto } from './dto/create-user_vocabulary.dto';
import { UpdateUserVocabularyDto } from './dto/update-user_vocabulary.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('user-vocabularies')
export class UserVocabulariesController {
  constructor(
    private readonly userVocabulariesService: UserVocabulariesService,
  ) {}

  @Post()
  create(@Body() createUserVocabularyDto: CreateUserVocabularyDto) {
    return this.userVocabulariesService.create(createUserVocabularyDto);
  }

  @Get()
  findAll() {
    return this.userVocabulariesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userVocabulariesService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserVocabularyDto: UpdateUserVocabularyDto,
  ) {
    return this.userVocabulariesService.update(+id, updateUserVocabularyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userVocabulariesService.remove(+id);
  }

  @Patch(':id/mark')
  async mark(
    @CurrentUser() user: User,
    @Body() body: { status: boolean },
    @Param('id') id: string,
  ) {
    const userId = user.id;
    const result = await this.userVocabulariesService.markAsImportant(
      id,
      userId,
      body.status,
    );
    return result;
  }

  @Get('list')
  async getReviewList(
    @CurrentUser() user: User,
    @Query('limit') limit?: string,
  ) {
    const result = await this.userVocabulariesService.selectReviewList(
      user.id,
      Number(limit) || 20,
    );
    return {
      total: result.length,
      data: result.map((uv) => ({
        id: uv.id,
        vocabId: uv.vocabulary.id,
        word: uv.vocabulary.word,
        meaning: uv.vocabulary.meaning,
        strength: uv.strength,
        learningStage: uv.learningStage,
      })),
    };
  }

  @Get('review-vocab')
  async getReviewItems(
    @CurrentUser() user: User,
    @Query('limit') limit?: string,
  ) {
    const userVocabs = await this.userVocabulariesService.selectReviewList(
      user.id,
      Number(limit) || 10,
    );

    const vocabularies = userVocabs.map((uv) => uv.vocabulary);
    const items = await this.userVocabulariesService.createItems(vocabularies);

    return {
      sessionId: `review_${Date.now()}`,
      totalItems: items.length,
      items,
    };
  }

  @Post('update')
  async updateReviewResult(
    @CurrentUser() user: User,
    @Body() body: { vocabId: string; isCorrect: boolean },
  ) {
    const updated = await this.userVocabulariesService.updateAfterReview(
      user.id,
      body.vocabId,
      body.isCorrect,
    );

    return {
      vocabId: body.vocabId,
      learningStage: updated.learningStage,
      strength: updated.strength,
      nextReviewAt: updated.nextReviewAt,
    };
  }
}
