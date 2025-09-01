import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TestService } from './test.service';
import { TestDto } from './dto/create-test.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { Test } from '@nestjs/testing';

@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @Public()
  create(@Body() dto: TestDto) {
    console.log('DTO:', dto);

    return this.testService.create(dto);
  }

  @Get()
  findAll() {
    return this.testService.findAll();
  }
}
