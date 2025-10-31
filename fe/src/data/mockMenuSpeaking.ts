import { Image } from "lucide-react";

export const speakingExerciseTypes = [
  {
    id: "1",
    name: "Đọc to đoạn văn",
    slug: "read-aloud",
    imageUrl:
      "https://edubenchmark.com/blog/wp-content/uploads/2020/12/How-to-Score-High-in-PTE-Speaking-Read-Aloud.jpg",
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
    id: "3",
    name: "Mô tả hình ảnh",
    slug: "describe-picture",
    imageUrl: "https://r2.erweima.ai/i/4lkKO6p9SdOVkN7CQvFrCA.png",
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
  {
    id: "4",
    name: "Trả lời thông tin",
    slug: "respond-using-info",
    imageUrl:
      "https://img.freepik.com/free-vector/customer-support-flat-design-illustration_23-2148889374.jpg",
    description:
      "Đọc thông tin được cung cấp và trả lời các câu hỏi dựa trên nội dung đó một cách chính xác và logic.",
    difficulty: "Medium",
    difficultyColor: "bg-blue-100 text-blue-800",
    order: 4,
    exerciseCount: 18,
    estimatedTime: "15-20 phút",
    gradient: "from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
    instruction: [
      "Đọc kỹ thông tin được cung cấp trước khi nghe câu hỏi.",
      "Tập trung vào những chi tiết quan trọng như thời gian, địa điểm, số liệu.",
      "Nghe câu hỏi một cách cẩn thận và xác định thông tin cần thiết để trả lời.",
      "Trả lời trực tiếp, ngắn gọn dựa trên thông tin đã cho.",
      "Sử dụng từ ngữ chính xác và cấu trúc câu rõ ràng.",
    ],
    subTopics: [
      {
        id: "4-1",
        title: "Thông tin hội nghị",
        slug: "conference-info",
        description:
          "Trả lời câu hỏi về lịch trình, địa điểm và nội dung hội nghị.",
        level: "Medium",
        progress: 0,
        total: 6,
        gradient: "from-purple-50 to-pink-50",
      },
      {
        id: "4-2",
        title: "Thông báo công ty",
        slug: "company-announcements",
        description:
          "Phản hồi câu hỏi về chính sách, sự kiện và thông báo trong công ty.",
        level: "Medium",
        progress: 0,
        total: 6,
        gradient: "from-pink-50 to-fuchsia-50",
      },
      {
        id: "4-3",
        title: "Thông tin sự kiện",
        slug: "event-information",
        description:
          "Trả lời về thời gian, địa điểm và yêu cầu tham gia các sự kiện.",
        level: "Hard",
        progress: 0,
        total: 6,
        gradient: "from-fuchsia-50 to-purple-50",
      },
    ],
  },
  {
    id: "5",
    name: "Nêu quan điểm cá nhân",
    vietnameseName: "Nêu quan điểm cá nhân",
    slug: "express-opinion",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    description:
      "Phát triển kỹ năng trình bày quan điểm cá nhân về các chủ đề đa dạng với lý lẽ thuyết phục và ví dụ cụ thể.",
    difficulty: "Hard",
    difficultyColor: "bg-red-100 text-red-800",
    order: 5,
    exerciseCount: 15,
    estimatedTime: "20-25 phút",
    gradient: "from-red-50 to-pink-50",
    borderColor: "border-red-200",
    instruction: [
      "Đọc kỹ chủ đề và suy nghĩ về quan điểm của bạn trước khi nói.",
      "Bắt đầu với câu thesis statement rõ ràng về lập trường của bạn.",
      "Đưa ra 2-3 lý lẽ chính để ủng hộ quan điểm với ví dụ cụ thể.",
      "Sử dụng từ nối để tạo mạch lạc: 'First', 'Moreover', 'In conclusion'.",
      "Kết thúc bằng cách tóm tắt quan điểm và khẳng định lại lập trường.",
    ],
    subTopics: [
      {
        id: "5-1",
        title: "Công nghệ và đời sống",
        slug: "technology-life",
        description:
          "Trình bày quan điểm về tác động của công nghệ trong cuộc sống hiện đại.",
        level: "Medium",
        progress: 0,
        total: 5,
        gradient: "from-red-50 to-pink-50",
      },
      {
        id: "5-2",
        title: "Giáo dục và học tập",
        slug: "education-learning",
        description:
          "Nêu ý kiến về phương pháp học tập và hệ thống giáo dục hiện tại.",
        level: "Hard",
        progress: 0,
        total: 5,
        gradient: "from-pink-50 to-fuchsia-50",
      },
      {
        id: "5-3",
        title: "Môi trường làm việc",
        slug: "work-environment",
        description:
          "Thảo luận về các xu hướng làm việc và môi trường công ty lý tưởng.",
        level: "Hard",
        progress: 0,
        total: 5,
        gradient: "from-fuchsia-50 to-red-50",
      },
    ],
  },
];
