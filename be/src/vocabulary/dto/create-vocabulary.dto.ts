import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';

export class CreateVocabularyDto {
  @Expose()
  @IsString()
  word: string;

  @Expose()
  @IsString()
  meaning: string;

  @Expose()
  @IsOptional()
  @IsString()
  pronunciation?: string;

  @Expose()
  @IsOptional()
  @IsString()
  partOfSpeech?: string;

  @Expose()
  @IsOptional()
  @IsString()
  exampleEn?: string;

  @Expose()
  @IsOptional()
  @IsString()
  exampleVn?: string;

  @Expose()
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @Expose()
  @IsOptional()
  @IsString()
  lemma?: string;

  @Expose()
  @IsOptional()
  @IsEnum(['ai_generated', 'toeic', 'exercise'])
  type?: 'ai_generated' | 'toeic' | 'exercise';

  @Expose()
  @IsOptional()
  @IsBoolean()
  isPhrase?: boolean;
}
