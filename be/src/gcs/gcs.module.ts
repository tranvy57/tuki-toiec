import { Module } from '@nestjs/common';
import { GcsService } from './gcs.service';
import { GcsController } from './gcs.controller';

@Module({
  controllers: [GcsController],
  providers: [GcsService],
  exports: [GcsService],
})
export class GcsModule {}
