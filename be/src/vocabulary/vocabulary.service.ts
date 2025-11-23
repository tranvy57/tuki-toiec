import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import * as XLSX from 'xlsx';
import { Repository } from 'typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VocabularyMapper } from './utils/vocabulary.mapper';
import axios from 'axios';
import { UserVocabulariesService } from 'src/user_vocabularies/user_vocabularies.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private vocabularyRepo: Repository<Vocabulary>,
    @Inject()
    private readonly userVocabService: UserVocabulariesService,
  ) {}
  async create(dto: CreateVocabularyDto) {
    const entity = VocabularyMapper.fromCreateDto(dto);
    const saved = await this.vocabularyRepo.save(entity);
    return VocabularyMapper.toDto(saved);
  }

  async findAll(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [entities, total] = await this.vocabularyRepo.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: VocabularyMapper.toDtoList(entities),
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async search(query: {
    search?: string;
    type?: string;
    partOfSpeech?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, type, partOfSpeech, page = 1, limit = 50 } = query;

    const qb = this.vocabularyRepo.createQueryBuilder('vocabulary');

    if (search) {
      qb.where(
        '(vocabulary.word ILIKE :search OR vocabulary.meaning ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (type) {
      qb.andWhere('vocabulary.type = :type', { type });
    }

    if (partOfSpeech) {
      qb.andWhere('vocabulary.partOfSpeech = :partOfSpeech', { partOfSpeech });
    }

    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit).orderBy('vocabulary.createdAt', 'DESC');

    const [entities, total] = await qb.getManyAndCount();

    return {
      data: VocabularyMapper.toDtoList(entities),
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const vocabulary = await this.vocabularyRepo.findOne({ where: { id: id } });
    if (!vocabulary) {
      throw new NotFoundException('Vocabulary not found!');
    }
    return VocabularyMapper.toDto(vocabulary);
  }

  async update(id: string, updateVocabularyDto: UpdateVocabularyDto) {
    const vocabulary = await this.vocabularyRepo.findOne({ where: { id } });
    if (!vocabulary) {
      throw new NotFoundException('Vocabulary not found!');
    }
    const updated = Object.assign(vocabulary, updateVocabularyDto);
    const saved = await this.vocabularyRepo.save(updated);
    return VocabularyMapper.toDto(saved);
  }

  async remove(id: string) {
    const vocabulary = await this.vocabularyRepo.findOne({ where: { id } });
    if (!vocabulary) {
      throw new NotFoundException('Vocabulary not found!');
    }
    await this.vocabularyRepo.remove(vocabulary);
    return { success: true, message: 'Vocabulary deleted successfully' };
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

  /**
   * Tra từ (nếu chưa có thì gọi API để bổ sung)
   */
  async lookupWord(word: string, user: User) {
    word = word.trim().toLowerCase();

    let vocab = await this.vocabularyRepo.findOne({ where: { word } });
    if (vocab) {
      const userVocab = await this.userVocabService.track(user.id, vocab.id, {
        source: 'search',
        incrementStrength: true,
      });
      return { ...vocab, isMarked: userVocab.isBookmarked };
    }

    let res;
    try {
      res = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      );
    } catch (e) {
      throw new HttpException(
        `Không tìm thấy định nghĩa cho từ "${word}"`,
        404,
      );
    }

    const data = Array.isArray(res.data) ? res.data[0] : res.data;
    const parsed = this.parseDictionaryApiResponse(data);

    try {
      const [meaningVi, exampleVi] = await Promise.all([
        this.translateToVietnamese(word),
        parsed.exampleEn
          ? this.translateToVietnamese(parsed.exampleEn)
          : Promise.resolve(undefined),
      ]);

      parsed.meaning = meaningVi;
      parsed.exampleVn = exampleVi;
    } catch (err) {
      console.warn('⚠️ Bỏ qua phần dịch tiếng Việt:', err.message);
    }

    vocab = this.vocabularyRepo.create({
      ...parsed,
      type: 'ai_generated',
    });
    const vocabSaved = await this.vocabularyRepo.save(vocab);

    const userVocab = await this.userVocabService.track(
      user.id,
      vocabSaved.id,
      {
        source: 'search',
        incrementStrength: true,
      },
    );

    return { ...vocabSaved, isMarked: userVocab.isBookmarked };
  }

  /**
   * Parse dữ liệu từ dictionaryapi.dev
   */
  private parseDictionaryApiResponse(entry: any) {
    const phonetic =
      entry.phonetics?.find((p) => p.text)?.text ??
      entry.phonetics?.[0]?.text ??
      null;

    const audioUrl =
      entry.phonetics?.find((p) => p.audio)?.audio ??
      entry.phonetics?.[0]?.audio ??
      null;

    const meaning = entry.meanings
      ?.map((m) => {
        const def = m.definitions?.[0]?.definition ?? '';
        return `${m.partOfSpeech}: ${def}`;
      })
      .join('; ');

    const exampleEn =
      entry.meanings?.flatMap((m) => m.definitions).find((d) => d.example)
        ?.example || null;

    return {
      word: entry.word,
      pronunciation: phonetic,
      meaning,
      exampleEn,
      partOfSpeech: entry.meanings?.[0]?.partOfSpeech ?? null,
      exampleVn: undefined,
      audioUrl,
    };
  }

  private async translateToVietnamese(text: string) {
    if (!text) return null;

    const apiKey = process.env.GOOGLE_TRANSLATE_KEY;
    if (!apiKey) return text; //

    const res = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        q: text,
        target: 'vi',
      },
    );

    return res.data.data.translations[0].translatedText;
  }
}
