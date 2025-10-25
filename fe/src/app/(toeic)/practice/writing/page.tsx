"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Image as ImageIcon,
  Mail,
  BookOpen,
  Edit3,
  ArrowRight,
  Sparkles,
  Clock,
  Target,
  Bot,
  Zap,
  Check,
  Icon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { writingExerciseTypes } from "@/data/mockDataWritting";
import { CustomCard } from "@/components/CustomCard";

//   {
//     id: "1",
//     imageUrl: "https://static.athenaonline.vn//img.tmp/48%20edit.png",
//     name: "Mô tả hình ảnh",
//     slug: "describe-picture",
//     description: "Viết 5 câu mô tả dựa trên hình ảnh cho sẵn",
//     icon: ImageIcon,
//     difficulty: "Easy",
//     difficultyColor: "bg-green-100 text-green-800",
//     order: 1,
//     exerciseCount: 25,
//     estimatedTime: "10-15 phút",
//     gradient: "from-green-50 to-emerald-50",
//     borderColor: "border-green-200",
//     subTopics: [
//       {
//         id: "1-1",
//         title: "Địa điểm công cộng",
//         description:
//           "Luyện viết mô tả các địa điểm như công viên, thư viện, nhà hàng...",
//         icon: Image,
//         level: "Easy",
//         progress: 2,
//         total: 10,
//         gradient: "from-green-50 to-emerald-50",
//       },
//       {
//         id: "1-2",
//         title: "Hoạt động thường ngày",
//         description:
//           "Mô tả hành động của con người trong cuộc sống thường nhật.",
//         icon: Image,
//         level: "Medium",
//         progress: 0,
//         total: 8,
//         gradient: "from-lime-50 to-green-50",
//       },
//       {
//         id: "1-3",
//         title: "Tình huống tại nơi làm việc",
//         description:
//           "Viết mô tả nhân viên đang họp, sử dụng máy tính, hoặc giao tiếp.",
//         icon: Image,
//         level: "Medium",
//         progress: 0,
//         total: 7,
//         gradient: "from-emerald-50 to-teal-50",
//       },
//     ],
//   },
//   {
//     id: "2",
//     imageUrl:
//       "https://media-blog.jobsgo.vn/blog/wp-content/uploads/2022/06/cach-viet-email-dung-chuan.jpg",
//     name: "Trả lời email",
//     slug: "email-response",
//     description: "Viết phản hồi cho một email về công việc hoặc yêu cầu",
//     icon: Mail,
//     difficulty: "Medium",
//     difficultyColor: "bg-yellow-100 text-yellow-800",
//     order: 2,
//     exerciseCount: 18,
//     estimatedTime: "15-20 phút",
//     gradient: "from-blue-50 to-cyan-50",
//     borderColor: "border-blue-200",
//     subTopics: [
//       {
//         id: "2-1",
//         title: "Giao tiếp công việc",
//         description: "Phản hồi email từ đồng nghiệp hoặc cấp trên.",
//         icon: Mail,
//         level: "Medium",
//         progress: 3,
//         total: 10,
//         gradient: "from-blue-50 to-cyan-50",
//       },
//       {
//         id: "2-2",
//         title: "Sắp lịch và lời mời",
//         description: "Viết email đặt lịch, mời họp, hoặc xác nhận tham dự.",
//         icon: Mail,
//         level: "Easy",
//         progress: 0,
//         total: 8,
//         gradient: "from-sky-50 to-blue-50",
//       },
//       {
//         id: "2-3",
//         title: "Phản hồi khách hàng",
//         description: "Trả lời câu hỏi, khiếu nại hoặc xác nhận đơn hàng.",
//         icon: Mail,
//         level: "Hard",
//         progress: 1,
//         total: 6,
//         gradient: "from-indigo-50 to-blue-50",
//       },
//     ],
//   },
//   {
//     id: "3",
//     imageUrl:
//       "https://dotb.vn/wp-content/uploads/2024/08/Ket-qua-hoc-tap-cua-hoc-sinh-thong-bao-ket-qua-hoc-tap-dotb.jpg",
//     name: "Viết đoạn nêu quan điểm",
//     slug: "opinion-essay",
//     description: "Viết đoạn văn 150-200 từ nêu quan điểm cá nhân về một chủ đề",
//     icon: BookOpen,
//     difficulty: "Hard",
//     difficultyColor: "bg-red-100 text-red-800",
//     order: 3,
//     exerciseCount: 12,
//     estimatedTime: "25-30 phút",
//     gradient: "from-purple-50 to-pink-50",
//     borderColor: "border-purple-200",
//     subTopics: [
//       {
//         id: "3-1",
//         title: "Công nghệ và đời sống",
//         description:
//           "Viết về tác động của công nghệ trong công việc và cuộc sống.",
//         icon: BookOpen,
//         level: "Medium",
//         progress: 0,
//         total: 6,
//         gradient: "from-purple-50 to-pink-50",
//       },
//       {
//         id: "3-2",
//         title: "Giáo dục và học tập",
//         description:
//           "Trình bày quan điểm về việc học online, bằng cấp, và kỹ năng mềm.",
//         icon: BookOpen,
//         level: "Hard",
//         progress: 0,
//         total: 5,
//         gradient: "from-pink-50 to-fuchsia-50",
//       },
//       {
//         id: "3-3",
//         title: "Môi trường và xã hội",
//         description: "Nêu ý kiến về bảo vệ môi trường và trách nhiệm cá nhân.",
//         icon: BookOpen,
//         level: "Medium",
//         progress: 0,
//         total: 4,
//         gradient: "from-fuchsia-50 to-rose-50",
//       },
//     ],
//   },
//   {
//     id: "4",
//     name: "Sửa câu sai",
//     imageUrl:
//       "https://ila.edu.vn/wp-content/uploads/2023/03/ila-ngu-phap-tieng-anh-co-ban-cho-hoc-sinh-tieu-hoc-3.jpg",
//     slug: "grammar-fix",
//     description: "Sửa lỗi ngữ pháp trong câu đã cho",
//     icon: Edit3,
//     difficulty: "Easy",
//     difficultyColor: "bg-green-100 text-green-800",
//     order: 4,
//     exerciseCount: 30,
//     estimatedTime: "5-10 phút",
//     gradient: "from-orange-50 to-amber-50",
//     borderColor: "border-orange-200",
//     subTopics: [
//       {
//         id: "4-1",
//         title: "Thì và động từ",
//         description: "Tập trung sửa lỗi thì động từ và dạng V-ing/to V.",
//         icon: Edit3,
//         level: "Easy",
//         progress: 5,
//         total: 12,
//         gradient: "from-amber-50 to-orange-50",
//       },
//       {
//         id: "4-2",
//         title: "Giới từ và danh từ",
//         description: "Sửa lỗi dùng sai giới từ, danh từ số ít/số nhiều.",
//         icon: Edit3,
//         level: "Medium",
//         progress: 2,
//         total: 10,
//         gradient: "from-orange-50 to-yellow-50",
//       },
//       {
//         id: "4-3",
//         title: "Cấu trúc phức tạp",
//         description:
//           "Chỉnh lỗi trong câu điều kiện, mệnh đề quan hệ, và câu ghép.",
//         icon: Edit3,
//         level: "Hard",
//         progress: 0,
//         total: 8,
//         gradient: "from-yellow-50 to-amber-50",
//       },
//     ],
//   },
// ];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function WritingPracticePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-pink-400/10 rounded-full blur-xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 py-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className=""
        >
          <div className="flex items-center justify-start gap-3 mb-4">
            <div className="p-3  rounded-xl ">
              <Edit3 className="w-4 h-4 " />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#23085A]">
              Writting
            </h1>
          </div>
          {/* Mô tả chính */}
          <p className="pb-4 text-lg">
            Phát triển khả năng diễn đạt ý tưởng rõ ràng, mạch lạc và tự nhiên
            theo chuẩn TOEIC. Với Tuki, bạn được luyện tập qua các bài viết mô
            phỏng đề thi thật, hệ thống sẽ tự động cá nhân hóa nội dung phù hợp
            với trình độ và mục tiêu điểm số của bạn.
          </p>
        </motion.div>

        <h1 className="text-4xl md:text-xl font-bold text-[#23085A] pb-4">
          Danh sách chủ đề:
        </h1>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 w-full">
          {writingExerciseTypes.map((exercise, i) => {
            console.log("exercise", exercise);

            return (
              <CustomCard
                key={exercise.slug}
                slug={exercise.slug}
                name={exercise.name}
                description={exercise.description}
                imageUrl={exercise.imageUrl}
                icon={exercise.icon}
                href={`/practice/writing/${exercise.slug}`}
              />
            );
          })}
        </div>

        {/* AI Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 mb-8"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Hỗ trợ AI thông minh
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Trải nghiệm tính năng AI tiên tiến giúp bạn cải thiện kỹ năng viết
              một cách hiệu quả
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="h-full bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Edit3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Tạo Email Mẫu
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    AI tạo email mẫu chuyên nghiệp theo ngữ cảnh, giúp bạn học
                    cách viết email hiệu quả và đúng chuẩn TOEIC.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="h-full bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Đánh Giá Thông Minh
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Phân tích chi tiết bài viết của bạn với điểm số, góp ý cải
                    thiện và gợi ý từ vựng nâng cao.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="h-full bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Phản Hồi Tức Thì
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Nhận phản hồi ngay lập tức về ngữ pháp, từ vựng và cấu trúc
                    câu để cải thiện bài viết hiệu quả.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-8"
        >
          <Card className="bg-gradient-to-r from-pink-50 via-blue-50 to-purple-50 border-pink-200 shadow-lg rounded-xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <span className="text-lg font-semibold text-gray-800">
                Mẹo học tập
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Bắt đầu với <strong>Mô tả hình ảnh</strong> và{" "}
              <strong>Sửa câu sai</strong> để làm quen. Sau đó thử thách bản
              thân với <strong>Trả lời email</strong> và{" "}
              <strong>Viết đoạn nêu quan điểm</strong>
              để nâng cao kỹ năng viết học thuật và doanh nghiệp.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
