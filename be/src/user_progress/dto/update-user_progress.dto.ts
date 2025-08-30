import { PartialType } from '@nestjs/swagger';
import { CreateUserProgressDto } from './create-user_progress.dto';

export class UpdateUserProgressDto extends PartialType(CreateUserProgressDto) {}
