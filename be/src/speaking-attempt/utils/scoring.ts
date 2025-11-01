// utils/scoring.ts
const clamp = (x: number, min: number, max: number) =>
  Math.max(min, Math.min(max, x));

export function normalizePronunciation(conf: number): number {
  if (conf == null || Number.isNaN(conf)) return 0;
  if (conf > 5) return clamp((conf / 100) * 5, 0, 5); // nếu nguồn 0–100
  if (conf <= 1.2) return clamp(conf * 5, 0, 5); // nếu nguồn 0–1
  return clamp(conf, 0, 5); // nếu sẵn 0–5
}

export function normalizeFluency(f: number): number {
  if (f == null || Number.isNaN(f)) return 0;
  if (f > 5) return clamp((f / 100) * 5, 0, 5); // nếu nguồn 0–100
  return clamp(f, 0, 5); // assume 0–5
}

type Weights = {
  pron: number;
  flu: number;
  gra: number;
  voc: number;
  task: number;
};

export function getWeights(type: string): Weights {
  const t = (type || '').toLowerCase();
  // Read Aloud: phát âm + lưu loát quan trọng hơn
  if (t === 'read_aloud' || t === 'read-aloud') {
    return { pron: 0.3, flu: 0.25, gra: 0.15, voc: 0.15, task: 0.15 };
  }
  // Describe / Respond / Opinion: nội dung-ngữ pháp-từ vựng quan trọng hơn
  return { pron: 0.15, flu: 0.2, gra: 0.25, voc: 0.2, task: 0.2 };
}

export function computeOverall(
  type: string,
  pron: number,
  flu: number,
  gra: number,
  voc: number,
  task: number,
): number {
  const w = getWeights(type);
  const overall =
    pron * w.pron + flu * w.flu + gra * w.gra + voc * w.voc + task * w.task;
  return +overall.toFixed(2); // 2 chữ số cho ổn định hiển thị
}
