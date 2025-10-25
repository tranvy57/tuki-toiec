import { Vocabulary } from "@/types/implements/vocabulary";
import { Item } from "@/types/implements/item";

// Mock vocabularies for testing
export const mockVocabulariesForLesson: Vocabulary[] = [
  {
    word: "achievement",
    meaning: "thành tựu, thành tích",
    pronunciation: "/əˈtʃiːvmənt/",
    partOfSpeech: "noun",
    exampleEn: "Her greatest achievement was winning the Nobel Prize.",
    exampleVn: "Thành tựu lớn nhất của cô ấy là giành giải Nobel.",
    audioUrl: "https://example.com/audio/achievement.mp3",
  },
  {
    word: "ambitious",
    meaning: "tham vọng, có tham vọng",
    pronunciation: "/æmˈbɪʃəs/",
    partOfSpeech: "adjective",
    exampleEn: "She is very ambitious and wants to become CEO.",
    exampleVn: "Cô ấy rất tham vọng và muốn trở thành CEO.",
    audioUrl: "https://example.com/audio/ambitious.mp3",
  },
  {
    word: "collaborate",
    meaning: "hợp tác, cộng tác",
    pronunciation: "/kəˈlæbəreɪt/",
    partOfSpeech: "verb",
    exampleEn: "We need to collaborate more effectively on this project.",
    exampleVn: "Chúng ta cần hợp tác hiệu quả hơn trong dự án này.",
    audioUrl: "https://example.com/audio/collaborate.mp3",
  },
  {
    word: "deadline",
    meaning: "thời hạn, hạn chót",
    pronunciation: "/ˈdedlaɪn/",
    partOfSpeech: "noun",
    exampleEn: "The deadline for the report is next Friday.",
    exampleVn: "Thời hạn nộp báo cáo là thứ Sáu tới.",
    audioUrl: "https://example.com/audio/deadline.mp3",
  },
  {
    word: "efficient",
    meaning: "hiệu quả, có hiệu suất cao",
    pronunciation: "/ɪˈfɪʃnt/",
    partOfSpeech: "adjective",
    exampleEn: "This new system is much more efficient than the old one.",
    exampleVn: "Hệ thống mới này hiệu quả hơn nhiều so với hệ thống cũ.",
    audioUrl: "https://example.com/audio/efficient.mp3",
  },
];

// Mock items for testing different modalities
export const mockItemsForLesson: Item[] = [
  {
    id: "item-1",
    modality: "dictation",
    difficulty: "easy",
    bandHint: 400,
    prompt: {
      title: "Business Meeting Discussion",
      instructions: "Listen to the conversation and write what you hear.",
      audioUrl: "https://example.com/audio/business-meeting.mp3",
      transcript:
        "We need to schedule a meeting for next week to discuss the quarterly results.",
    },
    solution: {
      text: "We need to schedule a meeting for next week to discuss the quarterly results.",
      keywords: ["schedule", "meeting", "quarterly", "results"],
    },
    rubric: {
      criteria: ["accuracy", "completeness", "spelling"],
      maxScore: 100,
    },
  },
  {
    id: "item-2",
    modality: "multiple-choice",
    difficulty: "medium",
    bandHint: 500,
    prompt: {
      title: "Company Policy Question",
      instructions: "Choose the best answer for the following question.",
      question: "What is the company's policy on working from home?",
      audioUrl: "https://example.com/audio/policy-question.mp3",
    },
    solution: {
      correctAnswer: "B",
      options: [
        "A. Employees must work in the office every day",
        "B. Employees can work from home up to 3 days per week",
        "C. Working from home is not allowed",
        "D. Only managers can work from home",
      ],
    },
  },
  {
    id: "item-3",
    modality: "listening",
    difficulty: "hard",
    bandHint: 650,
    prompt: {
      title: "Conference Call Comprehension",
      instructions: "Listen to the conference call and answer the questions.",
      audioUrl: "https://example.com/audio/conference-call.mp3",
      questions: [
        "What is the main topic of discussion?",
        "Who will be responsible for the new project?",
        "When is the project deadline?",
      ],
    },
    solution: {
      answers: [
        "Marketing strategy for the new product launch",
        "Sarah Johnson from the marketing team",
        "End of December",
      ],
    },
  },
  {
    id: "item-4",
    modality: "fill-blank",
    difficulty: "medium",
    bandHint: 520,
    prompt: {
      title: "Email Completion",
      instructions: "Fill in the blanks with the appropriate words.",
      text: "Dear Mr. Johnson,\n\nI am writing to _____ about the meeting scheduled for tomorrow. Due to _____ circumstances, we will need to _____ it to next week.\n\nBest regards,\nSarah",
    },
    solution: {
      blanks: [
        { position: 1, answer: "inform", alternatives: ["notify", "tell"] },
        {
          position: 2,
          answer: "unforeseen",
          alternatives: ["unexpected", "sudden"],
        },
        {
          position: 3,
          answer: "postpone",
          alternatives: ["reschedule", "delay"],
        },
      ],
    },
  },
  {
    id: "item-5",
    modality: "audio-comprehension",
    difficulty: "easy",
    bandHint: 380,
    prompt: {
      title: "Office Announcement",
      instructions:
        "Listen to the office announcement and identify the key information.",
      audioUrl: "https://example.com/audio/office-announcement.mp3",
    },
    solution: {
      keyPoints: [
        "Fire drill scheduled for 2 PM today",
        "All employees must evacuate via stairwells",
        "Meeting point is in the parking lot",
      ],
    },
  },
];

// Mock lesson content data with vocabularies and items
export const mockLessonContentsWithLearning = [
  {
    id: "content-vocab-1",
    type: "vocabulary" as const,
    content:
      "Trong bài học này, chúng ta sẽ học các từ vựng quan trọng liên quan đến môi trường làm việc và phát triển nghề nghiệp. Những từ này thường xuất hiện trong các bài thi TOEIC và trong công việc hàng ngày.",
    order: 1,
    isPremium: false,
    vocabularies: mockVocabulariesForLesson,
    lessonContentItems: [],
  },
  {
    id: "content-quiz-1",
    type: "quiz" as const,
    content:
      "Bây giờ chúng ta sẽ thực hành với các bài tập listening đa dạng. Các bài tập này sẽ giúp bạn làm quen với các dạng câu hỏi thường gặp trong phần Listening của TOEIC.",
    order: 2,
    isPremium: false,
    vocabularies: [],
    lessonContentItems: mockItemsForLesson.map((item, index) => ({
      item,
      orderIndex: index + 1,
    })),
  },
  {
    id: "content-strategy-1",
    type: "strategy" as const,
    content:
      "Để làm tốt phần listening, bạn cần nắm được một số chiến lược quan trọng:\n\n1. Đọc trước câu hỏi và các lựa chọn trả lời\n2. Chú ý đến từ khóa trong câu hỏi\n3. Lắng nghe thông tin cụ thể, không cần hiểu toàn bộ\n4. Loại trừ các đáp án không phù hợp\n5. Đoán thông minh nếu không chắc chắn",
    order: 3,
    isPremium: true,
    vocabularies: [],
    lessonContentItems: [],
  },
  {
    id: "content-vocab-premium",
    type: "vocabulary" as const,
    content:
      "Phần từ vựng nâng cao này chứa các từ vựng khó và quan trọng cho những ai muốn đạt điểm cao trong TOEIC. Hãy nâng cấp Premium để truy cập.",
    order: 4,
    isPremium: true,
    vocabularies: [
      {
        word: "procurement",
        meaning: "thu mua, mua sắm",
        pronunciation: "/prəˈkjʊrmənt/",
        partOfSpeech: "noun",
        exampleEn:
          "The procurement department handles all equipment purchases.",
        exampleVn: "Phòng thu mua xử lý tất cả việc mua thiết bị.",
        audioUrl: "https://example.com/audio/procurement.mp3",
      },
      {
        word: "expenditure",
        meaning: "chi tiêu, khoản chi",
        pronunciation: "/ɪkˈspendɪtʃər/",
        partOfSpeech: "noun",
        exampleEn: "We need to reduce our expenditure on unnecessary items.",
        exampleVn:
          "Chúng ta cần giảm chi tiêu cho những mặt hàng không cần thiết.",
        audioUrl: "https://example.com/audio/expenditure.mp3",
      },
    ],
    lessonContentItems: [],
  },
];
