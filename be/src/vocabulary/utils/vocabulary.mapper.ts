// src/vocabulary/utils/vocabulary.mapper.ts

import { Vocabulary } from '../entities/vocabulary.entity';
import { CreateVocabularyDto } from '../dto/create-vocabulary.dto';
import { VocabularyDto } from '../dto/vocabulary.dto';
import { plainToInstance } from 'class-transformer';

export class VocabularyMapper {
  static fromCreateDto(dto: CreateVocabularyDto): Vocabulary {
    const entity = new Vocabulary();
    entity.word = dto.word;
    entity.meaning = dto.meaning;
    entity.pronunciation = dto.pronunciation;
    entity.partOfSpeech = dto.partOfSpeech;
    entity.exampleEn = dto.exampleEn;
    entity.exampleVn = dto.exampleVn;
    entity.audioUrl = dto.audioUrl;
    return entity;
  }

  // Map entity sang response dto
  static toDto(entity: Vocabulary): VocabularyDto {
    return plainToInstance(VocabularyDto, entity, {
      excludeExtraneousValues: true,
    });
  }

  // Map array entity sang array response dto
  static toDtoList(entities: Vocabulary[]): VocabularyDto[] {
    return entities.map((e) => this.toDto(e));
  }
}
