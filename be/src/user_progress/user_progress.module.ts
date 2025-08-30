import { Module } from '@nestjs/common';
import { UserProgressService } from './user_progress.service';
import { UserProgressController } from './user_progress.controller';

@Module({
  controllers: [UserProgressController],
  providers: [UserProgressService],
})
export class UserProgressModule {}
