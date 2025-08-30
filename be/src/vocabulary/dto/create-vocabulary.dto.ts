import { Expose } from 'class-transformer';

export class CreateVocabularyDto {
  @Expose()
  word: string;

  @Expose()
  meaning: string;

  @Expose()
  pronunciation: string;

  @Expose()
  partOfSpeech: string;

  @Expose()
  exampleEn: string;

  @Expose()
  exampleVn: string;

  @Expose()
  audioUrl: string;
}
