import { Expose } from 'class-transformer';

export class VocabularyDto {
  @Expose()
  id: string;

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

  @Expose()
  lemma: string;

  @Expose()
  type: 'ai_generated' | 'toeic' | 'exercise';

  @Expose()
  isPhrase: boolean;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
