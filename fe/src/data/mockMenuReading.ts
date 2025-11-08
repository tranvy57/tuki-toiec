import { BookOpen } from "lucide-react";

export const mockReadingExercises = [
  {
    id: "1",
    name: "Multiple Choice Questions",
    slug: "mcq",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    description:
      "Đọc đoạn văn và chọn đáp án đúng từ các lựa chọn cho trước theo format chuẩn TOEIC Reading.",
    icon: BookOpen,
    difficulty: "Medium",
    difficultyColor: "bg-blue-100 text-blue-800",
    order: 1,
    exerciseCount: 30,
    estimatedTime: "20-30 phút",
    gradient: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200",
    instruction: [
      "Đọc kỹ đoạn văn trước khi xem câu hỏi.",
      "Xác định từ khóa quan trọng trong câu hỏi.",
      "Tìm thông tin tương ứng trong đoạn văn.",
      "Loại trừ các đáp án rõ ràng sai trước khi chọn đáp án cuối cùng.",
      "Chú ý các từ đồng nghĩa và paraphrase trong đoạn văn.",
    ],
  },
];
