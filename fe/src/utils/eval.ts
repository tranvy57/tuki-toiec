/**
 * Utility functions for answer evaluation
 */

/**
 * Soft match for translation answers
 * Returns a score between 0 and 1 based on keyword matching
 */
export function softMatchKeywords(answer: string, keywords: string[]): number {
  const normalizedAnswer = answer.toLowerCase().trim();
  let matchCount = 0;

  for (const keyword of keywords) {
    const normalizedKeyword = keyword.toLowerCase().trim();
    if (normalizedAnswer.includes(normalizedKeyword)) {
      matchCount++;
    }
  }

  return keywords.length > 0 ? matchCount / keywords.length : 0;
}

/**
 * Check if answer matches any of the acceptable keywords
 * Used for cloze exercises with multiple acceptable answers
 */
export function matchesAnyKeyword(answer: string, keywords: string[]): boolean {
  const normalizedAnswer = answer.toLowerCase().trim();
  return keywords.some((keyword) => {
    const normalizedKeyword = keyword.toLowerCase().trim();
    return (
      normalizedAnswer === normalizedKeyword ||
      normalizedAnswer.includes(normalizedKeyword)
    );
  });
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
