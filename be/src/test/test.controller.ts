import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TestService } from './test.service';
import { TestDto } from './dto/test.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { Test } from '@nestjs/testing';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { excelRowsToTestDto } from 'src/common/utils/excel-to-test-dto';

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
  @Public()
  async findAll() {
    return await this.testService.findAll();
  }

  @Post('import')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('audioUrl') audioUrl: string,
  ) {
    // Parse file excel
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // Map rows thành TestDto
    const testDto = excelRowsToTestDto(rows, title, audioUrl);

    // Gọi lại hàm create đã có
    return await this.testService.create(testDto);
  }
}
