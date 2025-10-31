export interface ListeningExerciseType {
  id: string;
  slug: string;
  name: string;
  vietnameseName: string;
  description: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  difficultyColor: string;
  estimatedTime: string;
  questionCount: string;
  icon: string;
  instructions: string[];
  tips: string[];
  skillsImproved: string[];
  subtopics: {
    id: string;
    name: string;
    vietnameseName: string;
    questionCount: number;
    description: string;
  }[];
}

export const mockListeningExercises: ListeningExerciseType[] = [
  {
    id: "1",
    slug: "mcq",
    name: "Multiple Choice Questions",
    vietnameseName: "Câu hỏi trắc nghiệm",
    description: "Nghe và chọn đáp án đúng từ các lựa chọn cho trước",
    difficulty: "Trung bình",
    difficultyColor: "bg-yellow-100 text-yellow-800 border-yellow-300",
    estimatedTime: "20-30 phút",
    questionCount: "25-40 câu",
    icon: "🎧",
    instructions: [
      "Nghe kỹ đoạn hội thoại hoặc độc thoại",
      "Đọc câu hỏi và các lựa chọn trước khi nghe",
      "Chọn đáp án đúng nhất dựa trên thông tin đã nghe",
      "Chú ý đến từ khóa và thông tin quan trọng",
    ],
    tips: [
      "Đọc trước câu hỏi để biết cần chú ý thông tin gì",
      "Ghi chú nhanh các từ khóa quan trọng trong khi nghe",
      "Không để lỡ phần đầu của đoạn audio",
      "Loại trừ các đáp án rõ ràng sai trước",
    ],
    skillsImproved: [
      "Khả năng nghe hiểu chi tiết",
      "Kỹ năng phân tích thông tin",
      "Tư duy logic trong việc chọn đáp án",
      "Khả năng tập trung trong thời gian dài",
    ],
    subtopics: [
      {
        id: "photos",
        name: "Photographs",
        vietnameseName: "Mô tả tranh",
        questionCount: 6,
        description: "Nghe và chọn câu mô tả chính xác nhất về bức tranh",
      },
      {
        id: "question-response",
        name: "Question-Response",
        vietnameseName: "Hỏi đáp",
        questionCount: 25,
        description: "Nghe câu hỏi và chọn câu trả lời phù hợp nhất",
      },
      {
        id: "short-conversations",
        name: "Short Conversations",
        vietnameseName: "Hội thoại ngắn",
        questionCount: 39,
        description: "Nghe hội thoại ngắn và trả lời câu hỏi về nội dung",
      },
      {
        id: "short-talks",
        name: "Short Talks",
        vietnameseName: "Bài nói ngắn",
        questionCount: 30,
        description: "Nghe bài nói ngắn và trả lời các câu hỏi liên quan",
      },
    ],
  },
];
