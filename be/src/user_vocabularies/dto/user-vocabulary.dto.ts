import { Expose, Type } from 'class-transformer';
import { VocabularyDto } from 'src/vocabulary/dto/vocabulary.dto';
import { Vocabulary } from 'src/vocabulary/entities/vocabulary.entity';

export class UserVocabularyDto {
  @Expose()
  @Type(() => VocabularyDto)
  vocabulary: VocabularyDto;
  @Expose()
  wrongCount: number;
  @Expose()
  correctCount: number;
  @Expose()
  status: string;
}
