import { BookOpen, ImageIcon, Mail } from "lucide-react";

// Mock data tương tự phần bạn có
export const writingExerciseTypes = [
  // {
  //   slug: "describe-picture",
  //   name: "Mô tả hình ảnh",
  //   imageUrl: "https://static.athenaonline.vn//img.tmp/48%20edit.png",
  //   instruction: [
  //     "Quan sát bức ảnh cẩn thận: xác định bối cảnh, đối tượng chính và hành động trong hình.",
  //     "Bắt đầu bằng câu giới thiệu tổng quát (e.g. 'The picture shows...').",
  //     "Sử dụng thì hiện tại tiếp diễn (Present Continuous) để mô tả hành động đang diễn ra.",
  //     "Tập trung vào các yếu tố chính: người, vật, địa điểm, và hoạt động.",
  //     "Tránh liệt kê rời rạc — hãy kết nối các câu mô tả bằng logic tự nhiên.",
  //     "Kiểm tra lại ngữ pháp và chính tả sau khi viết.",
  //   ],
  //   subTopics: [
  //     {
  //       id: "1-1",
  //       title: "Địa điểm công cộng",
  //       description:
  //         "Luyện viết mô tả các địa điểm như công viên, thư viện, nhà hàng...",

  //       level: "Easy",
  //       progress: 2,
  //       total: 10,
  //       gradient: "from-green-50 to-emerald-50",
  //     },
  //     {
  //       id: "1-2",
  //       title: "Hoạt động thường ngày",
  //       description:
  //         "Mô tả hành động của con người trong cuộc sống thường nhật.",

  //       level: "Medium",
  //       progress: 0,
  //       total: 8,
  //       gradient: "from-lime-50 to-green-50",
  //     },
  //     {
  //       id: "1-3",
  //       title: "Tình huống tại nơi làm việc",
  //       description:
  //         "Viết mô tả nhân viên đang họp, sử dụng máy tính, hoặc giao tiếp.",

  //       level: "Medium",
  //       progress: 0,
  //       total: 7,
  //       gradient: "from-emerald-50 to-teal-50",
  //     },
  //   ],
  // },
  {
    slug: "email-response",
    name: "Trả lời email",
    type: "email",
    icon: ImageIcon,
    description: "Quan sát và viết mô tả ngắn dựa trên hình ảnh cho sẵn.",
    imageUrl:
      "https://media-blog.jobsgo.vn/blog/wp-content/uploads/2022/06/cach-viet-email-dung-chuan.jpg",
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
        id: "item21",
        title: "Giao tiếp công việc",
        topic: "Phản hồi email từ đồng nghiệp hoặc cấp trên.",
        imageUrl:
          "https://media-blog.jobsgo.vn/blog/wp-content/uploads/2025/09/tra-loi-email-tham-gia-phong-van-image-1.jpg",
        level: "Medium",
        context: "Colleauge",
        wordLimit: 150,
      },
      {
        id: "item22",
        title: "Sắp lịch và lời mời",
        topic: "Viết email đặt lịch, mời họp, hoặc xác nhận tham dự.",
        imageUrl:
          "https://www.nhanlucdaiduong.com.vn/uploads/email-tu-choi-phong-van-5.jpg",
        level: "Easy",
        context: "Schedule Meeting",
        wordLimit: 100,
      },
      {
        id: "item23",
        title: "Phản hồi khách hàng",
        imageUrl:
          "https://www.shutterstock.com/image-photo/two-businesswomen-handshake-agreement-smiling-600nw-2658451829.jpg",
        topic: "Trả lời câu hỏi, khiếu nại hoặc xác nhận đơn hàng.",
        level: "Hard",
        context: "Customer",
        wordLimit: 200,
      },
    ],
  },
  {
    slug: "opinion-essay",
    icon: Mail,
    description: "Viết phản hồi email ngắn gọn, lịch sự và đúng ngữ cảnh.",
    name: "Viết đoạn nêu quan điểm",
    imageUrl:
      "https://dotb.vn/wp-content/uploads/2024/08/Ket-qua-hoc-tap-cua-hoc-sinh-thong-bao-ket-qua-hoc-tap-dotb.jpg",
    subTopics: [
      {
        id: "item31",
        title: "Công nghệ và đời sống",
        topic: "Viết về tác động của công nghệ trong công việc và cuộc sống.",
        level: "Medium",
        context: "Technology",
        wordLimit: 150,
      },
      {
        id: "item32",
        title: "Giáo dục và học tập",
        topic: "Trình bày quan điểm về học online, bằng cấp, kỹ năng mềm.",
        level: "Hard",
        context: "Education",
        wordLimit: 200,
      },
      {
        id: "item33",
        title: "Môi trường và xã hội",
        topic: "Nêu ý kiến về bảo vệ môi trường và trách nhiệm cá nhân.",
        level: "Medium",
        context: "Environment",
        wordLimit: 150,
      },
    ],
  },
  {
    slug: "grammar-fix",
    icon: BookOpen,
    description: "Trình bày ý kiến cá nhân rõ ràng, logic và có dẫn chứng.",
    name: "Sửa câu sai",
    imageUrl:
      "https://ila.edu.vn/wp-content/uploads/2023/03/ila-ngu-phap-tieng-anh-co-ban-cho-hoc-sinh-tieu-hoc-3.jpg",
    subTopics: [
      {
        id: "item41",
        title: "Thì và động từ",
        topic: "Tập trung sửa lỗi thì động từ và dạng V-ing/to V.",
        level: "Easy",
        context: "Tenses and Verbs",
        wordLimit: 30,
      },
      {
        id: "item42",
        title: "Giới từ và danh từ",
        topic: "Sửa lỗi dùng sai giới từ, danh từ số ít/số nhiều.",
        level: "Medium",
        context: "Prepositions and Nouns",
        wordLimit: 30,
      },
      {
        id: "item43",
        title: "Cấu trúc phức tạp",
        topic: "Chỉnh lỗi trong câu điều kiện, mệnh đề quan hệ, câu ghép.",
        level: "Hard",
        context: "Complex Structures",
        wordLimit: 30,
      },
    ],
  },
];
