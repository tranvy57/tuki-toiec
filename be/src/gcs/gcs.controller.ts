import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GcsService } from './gcs.service';
import { CreateGcDto } from './dto/create-gc.dto';
import { UpdateGcDto } from './dto/update-gc.dto';

@Controller('gcs')
export class GcsController {
  constructor(private readonly gcsService: GcsService) {}
}
