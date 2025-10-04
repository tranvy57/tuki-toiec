import { Unit, Lesson } from "../../../../types/type-lesson-mock";

export const MOCK_UNITS: Unit[] = [
  { id: 1, title: "Chương 1: Bắt đầu", progress: 100 },
  { id: 2, title: "Chương 2: Hội thoại cơ bản", progress: 65 },
  { id: 3, title: "Chương 3: Hoạt động hàng ngày", progress: 30 },
  { id: 4, title: "Chương 4: Chủ đề nâng cao", progress: 0 },
];

export const MOCK_LESSONS: Record<number, Lesson[]> = {
  1: [
    {
      id: 101,
      type: "vocab_flashcard",
      title: "Từ vựng: Lời chào",
      done: true,
      status: "completed",
      duration: "15 phút",
      unitId: 1,
    },
    {
      id: 102,
      type: "vocab_listening",
      title: "Từ vựng: Luyện nghe",
      done: true,
      status: "completed",
      duration: "20 phút",
      unitId: 1,
    },
  ],
  2: [
    {
      id: 201,
      type: "grammar_cloze",
      title: "Ngữ pháp: Thì hiện tại hoàn thành",
      done: true,
      status: "completed",
      duration: "18 phút",
      unitId: 2,
    },
    {
      id: 202,
      type: "grammar_formula",
      title: "Ngữ pháp: Thì quá khứ đơn",
      done: true,
      status: "completed",
      duration: "25 phút",
      unitId: 2,
    },
    {
      id: 203,
      type: "listening_mcq",
      title: "Câu hỏi hội thoại",
      done: false,
      status: "in_progress",
      duration: "30 phút",
      unitId: 2,
    },
    {
      id: 204,
      type: "listening_cloze",
      title: "Bài tập chính tả",
      locked: true,
      status: "not_started",
      duration: "15 phút",
      unitId: 2,
    },
  ],
  3: [
    {
      id: 301,
      type: "reading_mcq",
      title: "Từ vựng: Thói quen hàng ngày",
      done: true,
      status: "completed",
      duration: "16 phút",
      unitId: 3,
    },
    {
      id: 302,
      type: "reading_mcq",
      title: "Ghép nối hoạt động",
      done: false,
      status: "not_started",
      duration: "12 phút",
      unitId: 3,
    },
    {
      id: 303,
      type: "reading_mcq",
      title: "Nghe & Lặp lại",
      locked: true,
      status: "not_started",
      duration: "20 phút",
      unitId: 3,
    },
  ],
  4: [
    {
      id: 401,
      type: "vocab_flashcard",
      title: "Từ vựng nâng cao",
      locked: true,
      status: "not_started",
      duration: "25 phút",
      unitId: 4,
    },
    {
      id: 402,
      type: "vocab_listening",
      title: "Bài kiểm tra tổng hợp",
      locked: true,
      status: "not_started",
      duration: "45 phút",
      unitId: 4,
    },
  ],
};

// Lesson type icons mapping
export const LESSON_ICONS = {
  vocab: "BookOpen",
  quiz: "MessageSquare",
  match: "Grid3x3",
  listen: "Headphones",
  dict: "Mic",
} as const;

export const getTypeLesson = (id: number) => {
  return Object.values(MOCK_LESSONS)
    .flat()
    .find((lesson) => lesson.id === Number(id));
};
