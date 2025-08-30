import { Module } from '@nestjs/common';
import { PhaseLessonsService } from './phase_lessons.service';
import { PhaseLessonsController } from './phase_lessons.controller';

@Module({
  controllers: [PhaseLessonsController],
  providers: [PhaseLessonsService],
})
export class PhaseLessonsModule {}
