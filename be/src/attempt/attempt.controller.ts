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

@Controller('attempts')
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @Post()
  @Public()
  async createAttempt(
    @CurrentUser() user: User,
    @Body() dto: CreateAttemptDto,
  ) {
    return this.attemptService.createAttempt(dto, user);
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
