import { Image } from "lucide-react";

export const speakingExerciseTypes = [
  {
    id: "1",
    name: "Đọc to đoạn văn",
    slug: "read-aloud",
    imageUrl:
      "https://www.britishcouncil.vn/sites/default/files/styles/bc-landscape-800x450/public/1200x675-hoc-tieng-anh-cung-chuyen-gia-toan-cau.jpg?itok=ope7GUwq",
    description:
      "Luyện phát âm, ngữ điệu và ngắt nghỉ bằng cách đọc to các đoạn văn ngắn theo mẫu chuẩn TOEIC Speaking.",
    difficulty: "Easy",
    difficultyColor: "bg-green-100 text-green-800",
    order: 1,
    exerciseCount: 20,
    estimatedTime: "5-10 phút",
    gradient: "from-green-50 to-emerald-50",
    borderColor: "border-green-200",
    instruction: [
      "Đọc kỹ đoạn văn trước khi bắt đầu, xác định từ khó và trọng âm.",
      "Khi thu âm, nói rõ ràng, nhấn đúng trọng âm và ngắt nghỉ hợp lý.",
      "Chú ý ngữ điệu (intonation) — tăng nhẹ ở câu hỏi, hạ giọng ở câu khẳng định.",
      "Sau khi nói, nghe lại để nhận diện lỗi phát âm và tốc độ.",
      "Luyện tập thường xuyên với các chủ đề đa dạng để tăng tự nhiên khi nói.",
    ],
    subTopics: [
      {
        id: "1-1",
        slug: "short-passages",

        title: "Đoạn văn ngắn",
        description:
          "Đọc các đoạn văn ngắn 2-3 câu, chú trọng phát âm và tốc độ.",
        level: "Easy",
        progress: 3,
        total: 10,
        gradient: "from-green-50 to-emerald-50",
      },
      {
        id: "1-2",
        title: "Đoạn mô tả sản phẩm",
        slug: "product-descriptions",

        description:
          "Luyện đọc đoạn mô tả sản phẩm hoặc quảng cáo trong bài TOEIC thực tế.",
        level: "Medium",
        progress: 1,
        total: 8,
        gradient: "from-lime-50 to-green-50",
      },
      {
        id: "1-3",
        title: "Đoạn thông báo",
        slug: "announcements",
        description:
          "Đọc các đoạn thông báo, lời nhắn, hoặc thông tin công cộng.",
        level: "Medium",
        progress: 0,
        total: 6,
        gradient: "from-emerald-50 to-teal-50",
      },
    ],
  },
  {
    id: "2",
    name: "Lặp lại câu",
    slug: "repeat-sentence",
    imageUrl:
      "https://www.britishcouncil.vn/sites/default/files/styles/bc-landscape-800x450/public/1200x675-hoc-tieng-anh-cung-chuyen-gia-toan-cau.jpg?itok=ope7GUwq",
    description:
      "Nghe một câu tiếng Anh và lặp lại chính xác để luyện khả năng nghe-nói liền mạch.",
    difficulty: "Medium",
    difficultyColor: "bg-yellow-100 text-yellow-800",
    order: 2,
    exerciseCount: 25,
    estimatedTime: "10-15 phút",
    gradient: "from-yellow-50 to-orange-50",
    borderColor: "border-yellow-200",
    instruction: [
      "Nghe kỹ câu mẫu — tập trung vào ngữ điệu và cách nối âm.",
      "Lặp lại ngay sau khi nghe, cố gắng giữ nguyên tốc độ và nhịp nói.",
      "Nếu không nghe kịp, chia nhỏ câu thành từng cụm và luyện lại nhiều lần.",
      "Đừng đọc quá chậm — hãy giữ nhịp tự nhiên như người bản xứ.",
      "Ghi âm lại để so sánh độ chính xác và cải thiện dần.",
    ],
    subTopics: [
      {
        id: "2-1",
        title: "Câu ngắn thường gặp",
        slug: "short-sentences",

        description: "Luyện lặp lại các câu ngắn 4–6 từ trong giao tiếp.",
        level: "Easy",
        progress: 5,
        total: 10,
        gradient: "from-yellow-50 to-orange-50",
      },
      {
        id: "2-2",
        slug: "mid-length-sentences",

        title: "Câu trung bình",
        description:
          "Nghe và lặp lại câu dài hơn (8–12 từ), chú ý trọng âm và nối âm.",
        level: "Medium",
        progress: 2,
        total: 8,
        gradient: "from-orange-50 to-amber-50",
      },
      {
        id: "2-3",
        title: "Câu phức tạp",
        slug: "complex-sentences",

        description:
          "Thực hành lặp lại câu chứa mệnh đề phụ hoặc cấu trúc phức tạp.",
        level: "Hard",
        progress: 0,
        total: 7,
        gradient: "from-amber-50 to-yellow-50",
      },
    ],
  },
  {
    id: "3",
    name: "Mô tả hình ảnh",
    slug: "describe-picture",
    imageUrl:
      "https://www.britishcouncil.vn/sites/default/files/styles/bc-landscape-800x450/public/1200x675-hoc-tieng-anh-cung-chuyen-gia-toan-cau.jpg?itok=ope7GUwq",
    description:
      "Quan sát hình và mô tả chi tiết hành động, bối cảnh, và nhân vật bằng lời nói tự nhiên.",
    icon: Image,
    difficulty: "Hard",
    difficultyColor: "bg-red-100 text-red-800",
    order: 3,
    exerciseCount: 15,
    estimatedTime: "10-20 phút",
    gradient: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200",
    instruction: [
      "Quan sát bức ảnh trong 30 giây để nắm bối cảnh và chi tiết chính.",
      "Bắt đầu bằng câu tổng quát (e.g., 'The picture shows...').",
      "Sử dụng thì hiện tại tiếp diễn để mô tả hành động đang diễn ra.",
      "Mô tả vị trí, hoạt động, và cảm xúc của người hoặc vật trong ảnh.",
      "Kết thúc bằng nhận xét hoặc suy luận nhẹ (e.g., 'They might be...').",
    ],
    subTopics: [
      {
        id: "3-1",
        title: "Địa điểm công cộng",
        slug: "public-places",

        description:
          "Mô tả cảnh ở công viên, thư viện, sân bay hoặc quán cà phê.",
        icon: Image,
        level: "Easy",
        progress: 1,
        total: 8,
        gradient: "from-blue-50 to-cyan-50",
      },
      {
        id: "3-2",
        title: "Hoạt động nhóm",
        slug: "group-activities",

        description:
          "Mô tả nhóm người đang họp, ăn uống, làm việc hoặc học tập.",
        icon: Image,
        level: "Medium",
        progress: 0,
        total: 5,
        gradient: "from-sky-50 to-blue-50",
      },
      {
        id: "3-3",
        title: "Tình huống nghề nghiệp",
        slug: "workplace-situations",

        description:
          "Mô tả nhân viên văn phòng, bán hàng hoặc kỹ thuật viên đang làm việc.",
        icon: Image,
        level: "Hard",
        progress: 0,
        total: 6,
        gradient: "from-indigo-50 to-blue-50",
      },
    ],
  },
];
