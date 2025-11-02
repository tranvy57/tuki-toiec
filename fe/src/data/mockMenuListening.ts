import { Headphones, PenTool, BookOpen } from "lucide-react";

export const mockListeningExercises = [
  {
    id: "1",
    name: "Multiple Choice Questions",
    slug: "mcq",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    description:
      "Nghe đoạn hội thoại hoặc độc thoại và chọn đáp án đúng từ các lựa chọn cho trước theo format chuẩn TOEIC Listening.",
    difficulty: "Medium",
    difficultyColor: "bg-blue-100 text-blue-800",
    order: 1,
    exerciseCount: 30,
    estimatedTime: "20-30 phút",
    gradient: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200",
    instruction: [
      "Đọc trước câu hỏi và các lựa chọn trước khi nghe audio.",
      "Nghe kỹ thông tin chi tiết, chú ý từ khóa quan trọng.",
      "Không để lỡ phần đầu của đoạn hội thoại hoặc độc thoại.",
      "Loại trừ các đáp án rõ ràng sai trước khi chọn đáp án cuối cùng.",
      "Ghi chú nhanh các từ khóa quan trọng trong khi nghe.",
    ],
    
  },
  {
    id: "2",
    name: "Dictation",
    slug: "dictation",
    imageUrl:
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    description:
      "Nghe và viết lại chính xác từng từ, câu hoặc đoạn văn để rèn luyện khả năng nghe hiểu chi tiết.",
    icon: PenTool,
    difficulty: "Hard",
    difficultyColor: "bg-orange-100 text-orange-800",
    order: 2,
    exerciseCount: 25,
    estimatedTime: "15-25 phút",
    gradient: "from-orange-50 to-amber-50",
    borderColor: "border-orange-200",
    instruction: [
      "Nghe kỹ đoạn audio, có thể nghe lại nhiều lần nếu cần.",
      "Viết chính xác từng từ bạn nghe được, chú ý dấu câu.",
      "Chú ý các từ nối, giới từ và những từ nhỏ dễ bị bỏ sót.",
      "Kiểm tra lại chính tả và ngữ pháp sau khi hoàn thành.",
      "So sánh với đáp án để nhận biết những lỗi thường gặp.",
    ],
    subTopics: [
      {
        id: "2-1",
        title: "Từ vựng cơ bản",
        slug: "basic-vocabulary",
        description:
          "Nghe và viết lại các từ vựng cơ bản thường xuất hiện trong TOEIC.",
        level: "Easy",
        progress: 2,
        total: 10,
        gradient: "from-orange-50 to-amber-50",
      },
      {
        id: "2-2",
        title: "Câu đơn giản",
        slug: "simple-sentences",
        description: "Nghe và viết lại các câu đơn giản với cấu trúc cơ bản.",
        level: "Medium",
        progress: 0,
        total: 8,
        gradient: "from-amber-50 to-yellow-50",
      },
      {
        id: "2-3",
        title: "Đoạn văn ngắn",
        slug: "short-passages",
        description: "Nghe và viết lại các đoạn văn ngắn về chủ đề quen thuộc.",
        level: "Hard",
        progress: 0,
        total: 7,
        gradient: "from-yellow-50 to-orange-50",
      },
    ],
  },
  {
    id: "3",
    name: "Cloze Test",
    slug: "cloze",
    imageUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    description:
      "Nghe đoạn audio có các chỗ trống và điền từ thích hợp vào để hoàn thiện nội dung.",
    icon: BookOpen,
    difficulty: "Hard",
    difficultyColor: "bg-red-100 text-red-800",
    order: 3,
    exerciseCount: 20,
    estimatedTime: "15-20 phút",
    gradient: "from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
    instruction: [
      "Đọc trước toàn bộ đoạn văn để hiểu ngữ cảnh tổng thể.",
      "Nghe kỹ và chú ý đến các từ xung quanh chỗ trống.",
      "Suy nghĩ về loại từ cần điền (danh từ, động từ, tính từ, v.v.).",
      "Kiểm tra ngữ pháp và nghĩa của câu sau khi điền từ.",
      "Nghe lại để xác nhận đáp án của bạn là chính xác.",
    ],
    subTopics: [
      {
        id: "3-1",
        title: "Chủ đề kinh doanh",
        slug: "business-topics",
        description:
          "Điền từ vào các đoạn văn về môi trường công việc và kinh doanh.",
        level: "Medium",
        progress: 1,
        total: 8,
        gradient: "from-purple-50 to-pink-50",
      },
      {
        id: "3-2",
        title: "Chủ đề đời sống",
        slug: "daily-life",
        description:
          "Hoàn thiện các đoạn văn về cuộc sống hàng ngày và hoạt động xã hội.",
        level: "Medium",
        progress: 0,
        total: 7,
        gradient: "from-pink-50 to-fuchsia-50",
      },
      {
        id: "3-3",
        title: "Chủ đề học thuật",
        slug: "academic-topics",
        description: "Điền từ vào các bài khoa học, giáo dục và nghiên cứu.",
        level: "Hard",
        progress: 0,
        total: 5,
        gradient: "from-fuchsia-50 to-purple-50",
      },
    ],
  },
];
