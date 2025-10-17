export function calcConfidence(words: any[]) {
  const valid = words.filter((w) => w.confidence);
  const avg =
    valid.reduce((sum, w) => sum + w.confidence, 0) / (valid.length || 1);
  return +(avg * 5).toFixed(2); // scale 0–5
}

export function calcFluency(words: any[]) {
  if (words.length < 2) return 0;
  const start = parseFloat(words[0].startTime?.seconds ?? '0');
  const end = parseFloat(words.at(-1)?.endTime?.seconds ?? '0');
  const duration = Math.max(end - start, 1);
  const rate = words.length / duration; // words per second
  const score = Math.min(5, rate * 1.5); // normalize
  return +score.toFixed(2);
}

export function average(arr: number[]) {
  return +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
}