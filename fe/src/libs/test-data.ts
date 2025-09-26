import { TestItem } from "@/types/test";

export const mockTests: TestItem[] = [
  {
    test_id: 224,
    title: 'New Economy TOEIC Test 1',
    description: 'Full TOEIC practice test with listening and reading sections',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'medium'
  },
  {
    test_id: 1213,
    title: 'New Economy TOEIC Test 10',
    description: 'Advanced TOEIC practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'hard'
  },
  {
    test_id: 225,
    title: 'New Economy TOEIC Test 2',
    description: 'Standard TOEIC practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'medium'
  },
  {
    test_id: 226,
    title: 'New Economy TOEIC Test 3',
    description: 'Intermediate level TOEIC practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'medium'
  },
  {
    test_id: 227,
    title: 'New Economy TOEIC Test 4',
    description: 'Business focused TOEIC practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'medium'
  },
  {
    test_id: 228,
    title: 'New Economy TOEIC Test 5',
    description: 'Comprehensive TOEIC practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'medium'
  },
  {
    test_id: 1209,
    title: 'New Economy TOEIC Test 6',
    description: 'Updated format TOEIC practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'medium'
  },
  {
    test_id: 1214,
    title: 'New Economy TOEIC Test 7',
    description: 'Advanced level TOEIC practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'hard'
  },
  {
    test_id: 1211,
    title: 'New Economy TOEIC Test 8',
    description: 'Professional level TOEIC practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'hard'
  },
  {
    test_id: 1212,
    title: 'New Economy TOEIC Test 9',
    description: 'Expert level TOEIC practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'hard'
  },
  {
    test_id: 229,
    title: 'Economy (old format) TOEIC 4 Test 1',
    description: 'Classic format TOEIC practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'easy'
  },
  {
    test_id: 230,
    title: 'Economy (old format) TOEIC 4 Test 5',
    description: 'Traditional TOEIC practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'easy'
  },
  {
    test_id: 231,
    title: 'Economy (old format) TOEIC 5 Test 3',
    description: 'Foundation level TOEIC practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'easy'
  },
  {
    test_id: 232,
    title: 'Economy (old format) TOEIC 5 Test 6',
    description: 'Basic level TOEIC practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'easy'
  },
  {
    test_id: 265,
    title: 'Longman TOEIC (old format) Test 1',
    description: 'Longman series TOEIC practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'medium'
  },
  {
    test_id: 266,
    title: 'Longman TOEIC (old format) Test 2',
    description: 'Longman series practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'medium'
  },
  {
    test_id: 267,
    title: 'Longman TOEIC (old format) Test 4',
    description: 'Longman comprehensive practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'medium'
  },
  {
    test_id: 4560,
    title: 'Y1 TOEIC Test 1',
    description: 'Year 1 practice test series',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'easy'
  },
  {
    test_id: 4569,
    title: 'Y1 TOEIC Test 10',
    description: 'Year 1 advanced practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'medium'
  },
  {
    test_id: 4561,
    title: 'Y1 TOEIC Test 2',
    description: 'Year 1 beginner practice test',
    duration: 120,
    totalQuestions: 200,
    difficulty: 'easy'
  },
];

export function getDifficultyColor(difficulty: TestItem['difficulty']): string {
  switch (difficulty) {
    case 'easy':
      return 'text-green-500';
    case 'medium':
      return 'text-yellow-500';
    case 'hard':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

export function getDifficultyBgColor(difficulty: TestItem['difficulty']): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500/10';
    case 'medium':
      return 'bg-yellow-500/10';
    case 'hard':
      return 'bg-red-500/10';
    default:
      return 'bg-gray-500/10';
  }
}
