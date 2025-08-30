import { Module } from '@nestjs/common';
import { AttemptAnswersService } from './attempt_answers.service';
import { AttemptAnswersController } from './attempt_answers.controller';

@Module({
  controllers: [AttemptAnswersController],
  providers: [AttemptAnswersService],
})
export class AttemptAnswersModule {}
