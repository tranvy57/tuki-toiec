export const writingExerciseTypes = [
  {
    slug: "describe-picture",
    name: "Mô tả hình ảnh",
    imageUrl: "https://static.athenaonline.vn//img.tmp/48%20edit.png",
    description:
      "Rèn luyện kỹ năng mô tả hình ảnh, giúp diễn đạt bằng tiếng Anh tự nhiên, đúng ngữ pháp, phản ánh chính xác bối cảnh và hành động.",
    instruction: [
      "Quan sát bức ảnh cẩn thận: xác định bối cảnh, đối tượng chính và hành động trong hình.",
      "Bắt đầu bằng câu giới thiệu tổng quát (e.g. 'The picture shows...').",
      "Sử dụng thì hiện tại tiếp diễn (Present Continuous) để mô tả hành động đang diễn ra.",
      "Tập trung vào các yếu tố chính: người, vật, địa điểm, và hoạt động.",
      "Tránh liệt kê rời rạc — hãy kết nối các câu mô tả bằng logic tự nhiên.",
      "Kiểm tra lại ngữ pháp và chính tả sau khi viết.",
    ],
    subTopics: [
      {
        id: "1-1",
        title: "Địa điểm công cộng",
        description:
          "Luyện viết mô tả các địa điểm như công viên, thư viện, nhà hàng...",
        level: "Easy",
        progress: 2,
        total: 10,
        gradient: "from-green-50 to-emerald-50",
        prompt:
          "Nhìn vào hình ảnh của một người đàn ông đang làm việc trên laptop trong quán cà phê. Viết năm câu mô tả những gì bạn nhìn thấy.",
        attachmentUrl: "/images/writing_picture_1.jpg",
        difficulty: "Easy",
        difficultyColor: "bg-green-100 text-green-800",
        wordLimit: { min: 50, max: 80 },
        timeLimit: "10 phút",
        instructions: [
          "Viết 5 câu hoàn chỉnh mô tả hình ảnh",
          "Sử dụng thì hiện tại tiếp diễn (Present Continuous)",
          "Mô tả vị trí, hành động và đồ vật trong hình",
        ],
        sampleAnswer:
          "A man is sitting at a wooden table using his laptop. He is wearing glasses and drinking coffee. The cafe has a cozy atmosphere with warm lighting. There are other customers in the background. He appears to be concentrated on his work.",
      },
      {
        id: "1-2",
        title: "Hoạt động thường ngày",
        description:
          "Mô tả hành động của con người trong cuộc sống thường nhật.",
        level: "Medium",
        progress: 0,
        total: 8,
        gradient: "from-lime-50 to-green-50",
      },
      {
        id: "1-3",
        title: "Tình huống tại nơi làm việc",
        description:
          "Viết mô tả nhân viên đang họp, sử dụng máy tính, hoặc giao tiếp.",
        level: "Medium",
        progress: 0,
        total: 7,
        gradient: "from-emerald-50 to-teal-50",
      },
    ],
  },
  {
    slug: "email-response",
    name: "Trả lời email",
    imageUrl:
      "https://media-blog.jobsgo.vn/blog/wp-content/uploads/2022/06/cach-viet-email-dung-chuan.jpg",
    description:
      "Phát triển kỹ năng viết email chuyên nghiệp, phản hồi đúng ngữ cảnh và giọng điệu chuẩn doanh nghiệp.",
    instruction: [
      "Đọc kỹ yêu cầu của đề để xác định mục tiêu email (phản hồi, yêu cầu, xác nhận...).",
      "Bắt đầu bằng lời chào lịch sự phù hợp với ngữ cảnh (Dear Mr./Ms...).",
      "Mở đầu ngắn gọn, giới thiệu lý do viết email.",
      "Trả lời từng điểm của đề, sử dụng câu ngắn gọn, rõ ràng.",
      "Kết thúc bằng lời cảm ơn và câu kết lịch sự (e.g. 'I look forward to your reply.').",
      "Tránh viết quá dài, dùng giọng điệu chuyên nghiệp và lịch thiệp.",
    ],
    subTopics: [
      {
        id: "2-1",
        title: "Giao tiếp công việc",
        description: "Phản hồi email từ đồng nghiệp hoặc cấp trên.",
        imageUrl:
          "https://media-blog.jobsgo.vn/blog/wp-content/uploads/2025/09/tra-loi-email-tham-gia-phong-van-image-1.jpg",
        level: "Medium",
        progress: 3,
        total: 10,
        gradient: "from-blue-50 to-cyan-50",
        prompt:
          "Bạn nhận được email này: 'Could you confirm your availability for the meeting tomorrow morning at 10 AM? Please let me know if you need to reschedule.' Viết một câu trả lời lịch sự (50-80 từ).",
        difficulty: "Medium",
        difficultyColor: "bg-yellow-100 text-yellow-800",
        wordLimit: { min: 50, max: 80 },
        timeLimit: "15 phút",
        instructions: [
          "Bắt đầu với lời chào phù hợp",
          "Xác nhận hoặc đề xuất thời gian khác",
          "Kết thúc một cách lịch sự và chuyên nghiệp",
        ],
        estimatedTime: 10,
        sampleAnswer:
          "Thank you for your message. I confirm my availability for tomorrow's meeting at 10 AM. I look forward to our discussion. Please let me know if there are any materials I should prepare in advance. Best regards.",
      },
      {
        id: "2-2",
        title: "Sắp lịch và lời mời",
        description: "Viết email đặt lịch, mời họp, hoặc xác nhận tham dự.",
        imageUrl:
          "https://www.nhanlucdaiduong.com.vn/uploads/email-tu-choi-phong-van-5.jpg",
        level: "Easy",
        progress: 0,
        total: 8,
        gradient: "from-sky-50 to-blue-50",
      },
      {
        id: "2-3",
        title: "Phản hồi khách hàng",
        imageUrl:
          "https://www.shutterstock.com/image-photo/two-businesswomen-handshake-agreement-smiling-600nw-2658451829.jpg",
        description: "Trả lời câu hỏi, khiếu nại hoặc xác nhận đơn hàng.",
        level: "Hard",
        progress: 1,
        total: 6,
        gradient: "from-indigo-50 to-blue-50",
      },
    ],
  },
  {
    slug: "opinion-essay",
    name: "Viết đoạn nêu quan điểm",
    imageUrl:
      "https://dotb.vn/wp-content/uploads/2024/08/Ket-qua-hoc-tap-cua-hoc-sinh-thong-bao-ket-qua-hoc-tap-dotb.jpg",
    description:
      "Rèn luyện tư duy phản biện và cách trình bày quan điểm logic, phù hợp với phần Writing Part 2 TOEIC.",
    subTopics: [
      {
        id: "3-1",
        title: "Công nghệ và đời sống",
        description:
          "Viết về tác động của công nghệ trong công việc và cuộc sống.",
        level: "Medium",
        progress: 0,
        total: 6,
        gradient: "from-purple-50 to-pink-50",
        prompt:
          "Bạn có nghĩ rằng làm việc tại nhà tốt hơn làm việc tại văn phòng không? Viết một đoạn văn ngắn (150-200 từ) đưa ra quan điểm và lý do của bạn.",
        difficulty: "Hard",
        difficultyColor: "bg-red-100 text-red-800",
        wordLimit: { min: 150, max: 200 },
        timeLimit: "25 phút",
        instructions: [
          "Đưa ra quan điểm rõ ràng trong câu chủ đề",
          "Cung cấp 2-3 lý do cụ thể",
          "Sử dụng các từ nối để liên kết ý tưởng",
          "Kết luận khẳng định lại quan điểm",
        ],
        sampleAnswer:
          "I believe working from home offers significant advantages over traditional office work. Firstly, remote work eliminates commuting time, allowing employees to have better work-life balance and reduced stress. Moreover, the home environment often provides fewer distractions than busy offices, leading to increased productivity. However, I acknowledge that office work facilitates face-to-face collaboration and team building. Nevertheless, with modern communication tools, remote workers can maintain effective collaboration while enjoying the flexibility and comfort of their home workspace. Overall, the benefits of working from home outweigh the drawbacks in today's digital age.",
      },
      {
        id: "3-2",
        title: "Giáo dục và học tập",
        description:
          "Trình bày quan điểm về học online, bằng cấp, kỹ năng mềm.",
        level: "Hard",
        progress: 0,
        total: 5,
        gradient: "from-pink-50 to-fuchsia-50",
      },
      {
        id: "3-3",
        title: "Môi trường và xã hội",
        description: "Nêu ý kiến về bảo vệ môi trường và trách nhiệm cá nhân.",
        level: "Medium",
        progress: 0,
        total: 4,
        gradient: "from-fuchsia-50 to-rose-50",
      },
    ],
  },
  {
    slug: "grammar-fix",
    name: "Sửa câu sai",
    imageUrl:
      "https://ila.edu.vn/wp-content/uploads/2023/03/ila-ngu-phap-tieng-anh-co-ban-cho-hoc-sinh-tieu-hoc-3.jpg",
    description:
      "Củng cố kiến thức ngữ pháp thông qua việc nhận diện và chỉnh sửa lỗi trong câu tiếng Anh.",
    subTopics: [
      {
        id: "4-1",
        title: "Thì và động từ",
        description: "Tập trung sửa lỗi thì động từ và dạng V-ing/to V.",
        level: "Easy",
        progress: 5,
        total: 12,
        gradient: "from-amber-50 to-orange-50",
        prompt: "He don't has any time for do his homework yesterday night.",
        difficulty: "Easy",
        difficultyColor: "bg-green-100 text-green-800",
        wordLimit: { min: 10, max: 20 },
        timeLimit: "5 phút",
        instructions: [
          "Xác định lỗi ngữ pháp trong câu",
          "Sửa các lỗi về thì, động từ, giới từ",
          "Đảm bảo câu có ý nghĩa rõ ràng",
        ],
        correctAnswer: "He didn't have any time to do his homework last night.",
        commonErrors: [
          {
            error: "don't has",
            correction: "doesn't have / didn't have",
            explanation: "Lỗi chia động từ",
          },
          {
            error: "for do",
            correction: "to do",
            explanation: "Sử dụng sai giới từ",
          },
          {
            error: "yesterday night",
            correction: "last night",
            explanation: "Cách diễn đạt thời gian",
          },
        ],
      },
      {
        id: "4-2",
        title: "Giới từ và danh từ",
        description: "Sửa lỗi dùng sai giới từ, danh từ số ít/số nhiều.",
        level: "Medium",
        progress: 2,
        total: 10,
        gradient: "from-orange-50 to-yellow-50",
      },
      {
        id: "4-3",
        title: "Cấu trúc phức tạp",
        description:
          "Chỉnh lỗi trong câu điều kiện, mệnh đề quan hệ, câu ghép.",
        level: "Hard",
        progress: 0,
        total: 8,
        gradient: "from-yellow-50 to-amber-50",
      },
    ],
  },
];
