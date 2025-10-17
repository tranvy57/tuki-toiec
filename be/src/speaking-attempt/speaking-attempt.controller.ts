import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SpeakingAttemptService } from './speaking-attempt.service';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('speaking-attempt')
export class SpeakingAttemptController {
  constructor(
    private readonly speakingAttemptService: SpeakingAttemptService,
  ) {}

  @Post('evaluate')
  @UseInterceptors(FileInterceptor('audio'))
  async evaluate(
    @CurrentUser() user: User,
    @Body('question') question: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const base64Audio = file.buffer.toString('base64');

    return this.speakingAttemptService.handleEvaluate(
      base64Audio,
      question,
      user,
    );
  }
}
