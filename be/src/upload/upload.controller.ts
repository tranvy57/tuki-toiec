// src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/common/decorator/public.decorator';
import { cloudinaryStorage } from 'src/config/cloudinary.multer';

@Controller('upload')
export class UploadController {
  @Post('file')
  @Public()
  @UseInterceptors(FileInterceptor('file', { storage: cloudinaryStorage }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      url: file.path,
      public_id: file.filename,
      resource_type: file.mimetype,
    };
  }
}
