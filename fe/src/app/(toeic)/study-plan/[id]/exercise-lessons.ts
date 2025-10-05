import { Lesson } from "@/types/type-exercise";

// Mock exercise lesson data
const MOCK_LESSONS: Lesson[] = [
  {
    type: "vocab_flashcard",
    title: "Từ vựng: Thuật ngữ Kinh doanh",
    estimated_minutes: 5,
    items: [
      {
        id: "vf1",
        term: "negotiate",
        ipa: "/nɪˈɡoʊʃieɪt/",
        meaning: "thương lượng, đàm phán",
        example_en: "We need to negotiate the contract terms.",
        example_vi: "Chúng ta cần đàm phán các điều khoản hợp đồng.",
        tts_en: "negotiate",
        tags: ["business", "verb"],
      },
      {
        id: "vf2",
        term: "revenue",
        ipa: "/ˈrevənjuː/",
        meaning: "doanh thu",
        example_en: "The company's revenue increased by 20% this year.",
        example_vi: "Doanh thu của công ty tăng 20% trong năm nay.",
        tts_en: "revenue",
        tags: ["business", "noun"],
      },
    ],
  },
  {
    type: "vocab_listening",
    title: "Từ vựng Nghe: Cụm từ Thông dụng",
    estimated_minutes: 3,
    items: [
      {
        id: "vl1",
        audio_tts: "make a decision",
        question: "What does this phrase mean?",
        options: [
          "đưa ra quyết định",
          "tạo ra sự khác biệt",
          "làm việc chăm chỉ",
          "đạt được mục tiêu",
        ],
        correct_index: 0,
        explanation: "'Make a decision' means to choose between options.",
        vi_explanation:
          "'Make a decision' có nghĩa là đưa ra quyết định giữa các lựa chọn.",
      },
    ],
  },
  {
    type: "listening_cloze",
    title: "Nghe Điền từ: Điền vào chỗ trống",
    estimated_minutes: 4,
    items: [
      {
        id: "lc1",
        audio_tts: "The meeting will start at nine o'clock tomorrow morning.",
        text_with_blanks: "The meeting will start at ___ o'clock ___ morning.",
        blanks: ["nine", "tomorrow"],
        keywords: [
          ["nine", "9"],
          ["tomorrow", "tmr"],
        ],
        explanation: "Listen carefully for time expressions.",
        vi_explanation: "Lắng nghe cẩn thận các cụm từ chỉ thời gian.",
      },
    ],
  },
  {
    type: "listening_mcq",
    title: "Hiểu bài Nghe",
    estimated_minutes: 3,
    items: [
      {
        id: "lm1",
        audio_tts: "I will be attending the conference next week in New York.",
        question: "Where will the speaker go next week?",
        options: ["Los Angeles", "New York", "Chicago", "Boston"],
        correct_index: 1,
        explanation: "The speaker mentions 'New York' in the sentence.",
        vi_explanation: "Người nói đề cập đến 'New York' trong câu.",
      },
    ],
  },
  {
    type: "reading_mcq",
    title: "Hiểu bài Đọc",
    estimated_minutes: 8,
    items: [
      {
        id: "rm1",
        passage_en:
          "The TOEIC test is designed to measure English proficiency in a business context. It consists of two main sections: Listening and Reading. The Listening section includes four parts with various question types, while the Reading section has three parts focusing on grammar, vocabulary, and comprehension. Many companies use TOEIC scores to assess employees' English skills for international assignments.",
        questions: [
          {
            q: "What is the main purpose of the TOEIC test?",
            options: [
              "To test academic English",
              "To measure business English proficiency",
              "To evaluate writing skills",
              "To assess speaking ability",
            ],
            correct_index: 1,
            explanation:
              "The passage states TOEIC measures English proficiency in a business context.",
            vi_explanation:
              "Đoạn văn nói rằng TOEIC đo lường trình độ tiếng Anh trong bối cảnh kinh doanh.",
          },
          {
            q: "How many main sections does the TOEIC test have?",
            options: ["One", "Two", "Three", "Four"],
            correct_index: 1,
            explanation:
              "The passage mentions 'two main sections: Listening and Reading'.",
            vi_explanation: "Đoạn văn đề cập 'hai phần chính: Nghe và Đọc'.",
          },
        ],
      },
    ],
  },
  {
    type: "grammar_cloze",
    title: "Ngữ pháp: Điền vào chỗ trống",
    estimated_minutes: 4,
    items: [
      {
        id: "gc1",
        sentence_with_blank:
          "If I ___ more time, I would finish the report today.",
        options: ["have", "had", "will have", "would have"],
        correct_index: 1,
        rule: "Second conditional: If + past simple, would + base verb",
        explanation:
          "This is a second conditional sentence expressing a hypothetical situation.",
        vi_explanation:
          "Đây là câu điều kiện loại 2 diễn tả tình huống giả định.",
      },
    ],
  },
  {
    type: "grammar_formula",
    title: "Ngữ pháp: Chọn công thức đúng",
    estimated_minutes: 3,
    items: [
      {
        id: "gf1",
        prompt: "Which formula represents the passive voice in present simple?",
        options: [
          "Subject + am/is/are + past participle",
          "Subject + have/has + past participle",
          "Subject + will be + past participle",
          "Subject + was/were + past participle",
        ],
        correct_index: 0,
        rule: "Present simple passive: am/is/are + past participle",
        explanation:
          "The present simple passive uses am/is/are + past participle.",
        vi_explanation:
          "Câu bị động thì hiện tại đơn dùng am/is/are + quá khứ phân từ.",
      },
    ],
  },
];

// // Mock lesson mapping - you can expand this based on your lesson IDs
// export const EXERCISE_LESSONS_MAP: Record<number, Lesson> = {
//   101: SAMPLE_VOCAB_LESSON,
//   102: SAMPLE_VOCAB_LESSON,
//   201: SAMPLE_GRAMMAR_LESSON,
//   202: SAMPLE_LISTENING_LESSON,
//   203: SAMPLE_VOCAB_LESSON,
//   204: SAMPLE_GRAMMAR_LESSON,
// };

export const findLessonByType = (type: string): Lesson | undefined => {
  return MOCK_LESSONS.find((lesson) => lesson.type === type);
};
