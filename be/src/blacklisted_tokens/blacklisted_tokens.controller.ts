import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlacklistedTokensService } from './blacklisted_tokens.service';
import { CreateBlacklistedTokenDto } from './dto/create-blacklisted_token.dto';
import { UpdateBlacklistedTokenDto } from './dto/update-blacklisted_token.dto';

@Controller('blacklisted-tokens')
export class BlacklistedTokensController {
  constructor(private readonly blacklistedTokensService: BlacklistedTokensService) {}

  @Post()
  create(@Body() createBlacklistedTokenDto: CreateBlacklistedTokenDto) {
    return this.blacklistedTokensService.create(createBlacklistedTokenDto);
  }

  @Get()
  findAll() {
    return this.blacklistedTokensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blacklistedTokensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlacklistedTokenDto: UpdateBlacklistedTokenDto) {
    return this.blacklistedTokensService.update(+id, updateBlacklistedTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blacklistedTokensService.remove(+id);
  }
}
