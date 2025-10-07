import { TestResultPage } from "@/components/result/test-result-page";

// Mock data - replace with actual API call
const mockTestData = {
  testTitle: "TOEIC Practice Test #42",
  totalScore: 890,
  listeningScore: 450,
  readingScore: 440,
  accuracy: 82.5,
  correctCount: 165,
  incorrectCount: 28,
  skippedCount: 7,
  duration: "2h 15m",
  testDate: "2025-01-15",
  parts: [
    {
      part: 1,
      name: "Photographs",
      accuracy: 83.3,
      details: [
        {
          type: "People Photos",
          correct: 3,
          wrong: 1,
          skipped: 2,
          questionIds: [1, 2, 3, 4, 5, 6],
        },
        {
          type: "Object Photos",
          correct: 2,
          wrong: 0,
          skipped: 1,
          questionIds: [7, 8, 9, 10],
        },
      ],
    },
    {
      part: 2,
      name: "Question-Response",
      accuracy: 88.0,
      details: [
        {
          type: "Wh-Questions",
          correct: 12,
          wrong: 2,
          skipped: 1,
          questionIds: [
            11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
          ],
        },
        {
          type: "Yes/No Questions",
          correct: 10,
          wrong: 0,
          skipped: 0,
          questionIds: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
        },
      ],
    },
    {
      part: 3,
      name: "Conversations",
      accuracy: 85.0,
      details: [
        {
          type: "Short Conversations",
          correct: 17,
          wrong: 3,
          skipped: 0,
          questionIds: Array.from({ length: 20 }, (_, i) => i + 36),
        },
      ],
    },
    {
      part: 4,
      name: "Short Talks",
      accuracy: 80.0,
      details: [
        {
          type: "Announcements",
          correct: 12,
          wrong: 3,
          skipped: 0,
          questionIds: Array.from({ length: 15 }, (_, i) => i + 56),
        },
      ],
    },
    {
      part: 5,
      name: "Incomplete Sentences",
      accuracy: 90.0,
      details: [
        {
          type: "Grammar",
          correct: 18,
          wrong: 2,
          skipped: 0,
          questionIds: Array.from({ length: 20 }, (_, i) => i + 71),
        },
        {
          type: "Vocabulary",
          correct: 9,
          wrong: 1,
          skipped: 0,
          questionIds: Array.from({ length: 10 }, (_, i) => i + 91),
        },
      ],
    },
    {
      part: 6,
      name: "Text Completion",
      accuracy: 75.0,
      details: [
        {
          type: "Context-based",
          correct: 9,
          wrong: 3,
          skipped: 0,
          questionIds: Array.from({ length: 12 }, (_, i) => i + 101),
        },
      ],
    },
    {
      part: 7,
      name: "Reading Comprehension",
      accuracy: 78.0,
      details: [
        {
          type: "Single Passages",
          correct: 20,
          wrong: 5,
          skipped: 2,
          questionIds: Array.from({ length: 27 }, (_, i) => i + 113),
        },
        {
          type: "Double Passages",
          correct: 12,
          wrong: 4,
          skipped: 1,
          questionIds: Array.from({ length: 17 }, (_, i) => i + 140),
        },
        {
          type: "Triple Passages",
          correct: 8,
          wrong: 4,
          skipped: 0,
          questionIds: Array.from({ length: 12 }, (_, i) => i + 157),
        },
      ],
    },
  ],
  aiAnalysis:
    "You have strong listening comprehension skills, particularly in Part 2 (Question-Response) where you achieved 88% accuracy. Your grammar foundation is solid as evidenced by your 90% accuracy in Part 5. However, there's room for improvement in reading fluency, especially in Part 7 where complex passages require better time management and context inference. Focus on expanding your business and academic vocabulary to tackle multi-passage questions more effectively.",
  recommendations: [
    {
      icon: "🎧",
      title: "Improve Listening Inference",
      description:
        "Focus on Part 3 conversations to catch implied meaning and speaker intentions.",
    },
    {
      icon: "📖",
      title: "Expand Vocabulary",
      description:
        "Learn business and academic words from Part 7 readings to improve comprehension.",
    },
    {
      icon: "📚",
      title: "Review Grammar",
      description:
        "Reinforce advanced sentence structures and tenses for consistent accuracy.",
    },
    {
      icon: "⏱️",
      title: "Time Management",
      description:
        "Practice finishing reading tasks faster while maintaining accuracy in Part 7.",
    },
  ],
};

export default function Page() {
  return <TestResultPage data={mockTestData} />;
}
