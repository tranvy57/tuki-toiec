import { Injectable } from '@nestjs/common';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Phase } from './entities/phase.entity';
import { PhaseDto } from './dto/phase.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PhaseService {
  constructor(
    @InjectRepository(Phase) private readonly phaseRepo: Repository<Phase>,
  ) {}

  private toDTO(phase: Phase): PhaseDto {
    return plainToInstance(PhaseDto, phase, {
      excludeExtraneousValues: true,
    });
  }

  create(createPhaseDto: CreatePhaseDto) {
    return 'This action adds a new phase';
  }

  findAll() {
    return `This action returns all phase`;
  }

  findOne(id: number) {
    return `This action returns a #${id} phase`;
  }

  update(id: number, updatePhaseDto: UpdatePhaseDto) {
    return `This action updates a #${id} phase`;
  }

  remove(id: number) {
    return `This action removes a #${id} phase`;
  }

  async getPhaseLessons(phaseId: string) {
    const phase = await this.phaseRepo.findOne({
      where: { id: phaseId },
      relations: { phaseLessons: { lesson: true } },
    });
    if (!phase) return null;
    return this.toDTO(phase);
  }
}
