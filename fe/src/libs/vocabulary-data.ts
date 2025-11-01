import { Vocabulary } from "@/types/implements/vocabulary";

export async function getWordAudioUrl(word: string): Promise<string | null> {
  // Simulate getting audio URL
  return `https://example.com/audio/${word.toLowerCase()}.mp3`;
}
