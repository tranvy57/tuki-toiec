import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AttemptService } from './attempt.service';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Public } from 'src/common/decorator/public.decorator';
import { userInfo } from 'os';
import { CreateAttemptAnswerDto } from 'src/attempt_answers/dto/create-attempt_answer.dto';

@Controller('attempts')
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @Post()
  async createAttempt(
    @CurrentUser() user: User,
    @Body() dto: CreateAttemptDto,
  ) {
    return await this.attemptService.createAttempt(dto, user);
  }

  @Patch(':attemptId/answers')
  async saveAttemptAnswer(
    @CurrentUser() user: User,
    @Body() dto: CreateAttemptAnswerDto,
    @Param('attemptId') attemptId: string,
  ) {
    return this.attemptService.saveAttemptAnswer(attemptId, dto, user);
  }

  @Patch(':attemptId/submit')
  async submit(
    @CurrentUser() user: User,
    @Param('attemptId') attemptId: string,
  ) {
    return this.attemptService.submitAttempt(attemptId, user);
  }

  @Patch(':attemptId/answers/bulk')
  async saveAttemptAnswers(
    @CurrentUser() user: User,
    @Body() dtos: CreateAttemptAnswerDto[],
    @Param('attemptId') attemptId: string,
  ) {
    return this.attemptService.saveAttemptAnswers(attemptId, dtos, user);
  }

  @Patch(':attemptId/submit-review')
  async submitReview(
    @CurrentUser() user: User,
    @Param('attemptId') attemptId: string,
  ) {
    return this.attemptService.submitAttemptReview(attemptId, user);
  }

  @Get('history')
  async historyAttempt(
    @CurrentUser() user: User,
    @Param('attemptId') attemptId: string,
  ) {
    console.log('user', user);

    return this.attemptService.historyAttempt(user);
  }
  @Get()
  findAll() {
    return this.attemptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attemptService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attemptService.remove(+id);
  }
}
