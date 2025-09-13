import { ResultTestResponse } from './TestResponse';

// Interface thống kê
interface PartResult {
  partNumber: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  totalQuestions: number;
  accuracy: number;
}

interface ResultSummary {
  id: string;
  mode: 'practice' | 'test';
  startedAt: string;
  finishAt: string | null;
  status: 'in_progress' | 'submitted';
  duration: number; // in seconds
  parts: PartResult[];
  totalCorrect: number;
  totalIncorrect: number;
  totalSkipped: number;
  totalQuestions: number;
  accuracy: number;

  listeningScore: number | null;
  readingScore: number | null;
  totalScore: number | null;
}

function convertRawToToeic(rawCorrect: number): number {
  if (rawCorrect <= 0) return 5;
  if (rawCorrect >= 100) return 495;
  // tuyến tính: mỗi câu đúng ~4.9 điểm
  return Math.round(5 + (rawCorrect / 100) * (495 - 5));
}

const LISTENING_PARTS = [1, 2, 3, 4];
const READING_PARTS = [5, 6, 7];

export function mapResult(raw: ResultTestResponse): ResultSummary {
  const partResults: PartResult[] = [];
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalSkipped = 0;
  let totalQuestions = 0;

  let listeningCorrect = 0;
  let readingCorrect = 0;

  let duration = 0;
  if (raw.finishAt) {
    duration = (new Date(raw.finishAt).getTime() - new Date(raw.startedAt).getTime()) / 1000;
  } else {
    duration = (Date.now() - new Date(raw.startedAt).getTime()) / 1000;
  }

  for (const part of raw.parts) {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;
    let questionsCount = 0;

    for (const group of part.groups) {
      for (const q of group.questions) {
        questionsCount++;
        if (q.userAnswer?.isCorrect === true) correct++;
        else if (q.userAnswer?.isCorrect === false) incorrect++;
        else skipped++;
      }
    }

    totalCorrect += correct;
    totalIncorrect += incorrect;
    totalSkipped += skipped;
    totalQuestions += questionsCount;

    if (LISTENING_PARTS.includes(part.partNumber)) {
      listeningCorrect += correct;
    } else if (READING_PARTS.includes(part.partNumber)) {
      readingCorrect += correct;
    }

    partResults.push({
      partNumber: part.partNumber,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      skippedQuestions: skipped,
      totalQuestions: questionsCount,
      accuracy: questionsCount > 0 ? (correct / questionsCount) * 100 : 0,
    });
  }

  const listeningScore = convertRawToToeic(listeningCorrect);
  const readingScore = convertRawToToeic(readingCorrect);

  return {
    id: raw.id,
    mode: raw.mode,
    startedAt: raw.startedAt,
    duration: duration,
    finishAt: raw.finishAt,
    status: raw.status,
    parts: partResults,
    totalCorrect,
    totalIncorrect,
    totalSkipped,
    totalQuestions,
    accuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
    listeningScore,
    readingScore,
    totalScore: listeningScore + readingScore,
  };
}
