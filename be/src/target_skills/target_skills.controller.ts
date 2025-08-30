import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TargetSkillsService } from './target_skills.service';
import { CreateTargetSkillDto } from './dto/create-target_skill.dto';
import { UpdateTargetSkillDto } from './dto/update-target_skill.dto';

@Controller('target-skills')
export class TargetSkillsController {
  constructor(private readonly targetSkillsService: TargetSkillsService) {}

  @Post()
  create(@Body() createTargetSkillDto: CreateTargetSkillDto) {
    return this.targetSkillsService.create(createTargetSkillDto);
  }

  @Get()
  findAll() {
    return this.targetSkillsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.targetSkillsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTargetSkillDto: UpdateTargetSkillDto) {
    return this.targetSkillsService.update(+id, updateTargetSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.targetSkillsService.remove(+id);
  }
}
