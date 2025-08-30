import { Module } from '@nestjs/common';
import { TargetSkillsService } from './target_skills.service';
import { TargetSkillsController } from './target_skills.controller';

@Module({
  controllers: [TargetSkillsController],
  providers: [TargetSkillsService],
})
export class TargetSkillsModule {}
