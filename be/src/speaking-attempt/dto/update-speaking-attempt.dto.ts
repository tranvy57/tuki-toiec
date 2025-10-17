import { PartialType } from '@nestjs/swagger';
import { CreateSpeakingAttemptDto } from './create-speaking-attempt.dto';

export class UpdateSpeakingAttemptDto extends PartialType(CreateSpeakingAttemptDto) {}
