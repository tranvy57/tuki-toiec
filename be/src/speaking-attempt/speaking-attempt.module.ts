// speaking-attempt.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpeakingAttemptService } from './speaking-attempt.service';
import { SpeakingAttemptController } from './speaking-attempt.controller';
import { SpeakingAttempt } from './entities/speaking-attempt.entity';
import { GcsModule } from 'src/gcs/gcs.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([SpeakingAttempt]), GcsModule],
  providers: [SpeakingAttemptService],
  controllers: [SpeakingAttemptController],
  exports: [SpeakingAttemptService],
})
export class SpeakingAttemptModule {}
