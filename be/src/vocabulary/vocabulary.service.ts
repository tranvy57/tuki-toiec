import { Injectable } from '@nestjs/common';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import * as XLSX from 'xlsx';
import { Repository } from 'typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VocabularyMapper } from './utils/vocabulary.mapper';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private vocabularyRepo: Repository<Vocabulary>,
  ) {}
  async create(dto: CreateVocabularyDto) {
    const entity = VocabularyMapper.fromCreateDto(dto);
    const saved = await this.vocabularyRepo.save(entity);
    return VocabularyMapper.toDto(saved);
  }

  async findAll() {
    const entities = await this.vocabularyRepo.find();
    return VocabularyMapper.toDtoList(entities);
  }

  findOne(id: number) {
    return `This action returns a #${id} vocabulary`;
  }

  update(id: number, updateVocabularyDto: UpdateVocabularyDto) {
    return `This action updates a #${id} vocabulary`;
  }

  remove(id: number) {
    return `This action removes a #${id} vocabulary`;
  }

  async importFromExcel(file: Express.Multer.File) {
    // Đọc file excel
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // Lấy từng dòng dữ liệu, có header
    const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Tách header và data
    const [header, ...dataRows] = rows;

    const vocabularies = dataRows
      .filter((row) => row && row.length > 0)
      .map((row) => ({
        word: String(row[0]).trim(),
        meaning: String(row[1]).trim(),
        pronunciation: row[2] ? String(row[2]).trim() : '',
        partOfSpeech: row[3] ? String(row[3]).trim() : '',
        exampleEn: row[4] ? String(row[4]).trim() : '',
        exampleVn: row[5] ? String(row[5]).trim() : '',
        audioUrl: row[6] ? String(row[6]).trim() : '',
      }));

    // Lưu vào DB
    await this.vocabularyRepo.insert(vocabularies);

    return {
      success: true,
      count: vocabularies.length,
    };
  }
}
