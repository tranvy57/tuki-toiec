import { PartialType } from '@nestjs/swagger';
import { CreateGcDto } from './create-gc.dto';

export class UpdateGcDto extends PartialType(CreateGcDto) {}
