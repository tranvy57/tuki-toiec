import { Module } from '@nestjs/common';
import { BlacklistedTokensService } from './blacklisted_tokens.service';
import { BlacklistedTokensController } from './blacklisted_tokens.controller';

@Module({
  controllers: [BlacklistedTokensController],
  providers: [BlacklistedTokensService],
})
export class BlacklistedTokensModule {}
