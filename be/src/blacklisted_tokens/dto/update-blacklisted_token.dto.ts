import { PartialType } from '@nestjs/swagger';
import { CreateBlacklistedTokenDto } from './create-blacklisted_token.dto';

export class UpdateBlacklistedTokenDto extends PartialType(CreateBlacklistedTokenDto) {}
