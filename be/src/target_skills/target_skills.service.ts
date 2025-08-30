import { Injectable } from '@nestjs/common';
import { CreateTargetSkillDto } from './dto/create-target_skill.dto';
import { UpdateTargetSkillDto } from './dto/update-target_skill.dto';

@Injectable()
export class TargetSkillsService {
  create(createTargetSkillDto: CreateTargetSkillDto) {
    return 'This action adds a new targetSkill';
  }

  findAll() {
    return `This action returns all targetSkills`;
  }

  findOne(id: number) {
    return `This action returns a #${id} targetSkill`;
  }

  update(id: number, updateTargetSkillDto: UpdateTargetSkillDto) {
    return `This action updates a #${id} targetSkill`;
  }

  remove(id: number) {
    return `This action removes a #${id} targetSkill`;
  }
}
