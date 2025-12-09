import { Injectable } from '@nestjs/common';
import { CreateBlacklistedTokenDto } from './dto/create-blacklisted_token.dto';
import { UpdateBlacklistedTokenDto } from './dto/update-blacklisted_token.dto';

@Injectable()
export class BlacklistedTokensService {
  create(createBlacklistedTokenDto: CreateBlacklistedTokenDto) {
    return 'This action adds a new blacklistedToken';
  }

  findAll() {
    return `This action returns all blacklistedTokens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blacklistedToken`;
  }

  update(id: number, updateBlacklistedTokenDto: UpdateBlacklistedTokenDto) {
    return `This action updates a #${id} blacklistedToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} blacklistedToken`;
  }
}
