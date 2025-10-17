"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Mail,
  Edit3,
  Image as ImageIcon,
  Target,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Dữ liệu gốc đồng nhất với trang list
const writingExerciseTypes = [
  {
    slug: "describe-picture",
    name: "Mô tả hình ảnh",
    imageUrl: "https://static.athenaonline.vn//img.tmp/48%20edit.png",
    subTopics: [
      {
        id: "1-1",
        title: "Địa điểm công cộng",
        description:
          "Luyện viết mô tả các địa điểm như công viên, thư viện, nhà hàng...",
        icon: ImageIcon,
        level: "Easy",
        progress: 2,
        total: 10,
        gradient: "from-green-50 to-emerald-50",
      },
      {
        id: "1-2",
        title: "Hoạt động thường ngày",
        description:
          "Mô tả hành động của con người trong cuộc sống thường nhật.",
        icon: ImageIcon,
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
        icon: ImageIcon,
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
    subTopics: [
      {
        id: "2-1",
        title: "Giao tiếp công việc",
        description: "Phản hồi email từ đồng nghiệp hoặc cấp trên.",
        icon: Mail,
        level: "Medium",
        progress: 3,
        total: 10,
        gradient: "from-blue-50 to-cyan-50",
      },
      {
        id: "2-2",
        title: "Sắp lịch và lời mời",
        description: "Viết email đặt lịch, mời họp, hoặc xác nhận tham dự.",
        icon: Mail,
        level: "Easy",
        progress: 0,
        total: 8,
        gradient: "from-sky-50 to-blue-50",
      },
      {
        id: "2-3",
        title: "Phản hồi khách hàng",
        description: "Trả lời câu hỏi, khiếu nại hoặc xác nhận đơn hàng.",
        icon: Mail,
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
    subTopics: [
      {
        id: "3-1",
        title: "Công nghệ và đời sống",
        description:
          "Viết về tác động của công nghệ trong công việc và cuộc sống.",
        icon: BookOpen,
        level: "Medium",
        progress: 0,
        total: 6,
        gradient: "from-purple-50 to-pink-50",
      },
      {
        id: "3-2",
        title: "Giáo dục và học tập",
        description:
          "Trình bày quan điểm về học online, bằng cấp, kỹ năng mềm.",
        icon: BookOpen,
        level: "Hard",
        progress: 0,
        total: 5,
        gradient: "from-pink-50 to-fuchsia-50",
      },
      {
        id: "3-3",
        title: "Môi trường và xã hội",
        description: "Nêu ý kiến về bảo vệ môi trường và trách nhiệm cá nhân.",
        icon: BookOpen,
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
    subTopics: [
      {
        id: "4-1",
        title: "Thì và động từ",
        description: "Tập trung sửa lỗi thì động từ và dạng V-ing/to V.",
        icon: Edit3,
        level: "Easy",
        progress: 5,
        total: 12,
        gradient: "from-amber-50 to-orange-50",
      },
      {
        id: "4-2",
        title: "Giới từ và danh từ",
        description: "Sửa lỗi dùng sai giới từ, danh từ số ít/số nhiều.",
        icon: Edit3,
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
        icon: Edit3,
        level: "Hard",
        progress: 0,
        total: 8,
        gradient: "from-yellow-50 to-amber-50",
      },
    ],
  },
];

export default function WritingTopicsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const topic = writingExerciseTypes.find((t) => t.slug === slug);

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500">Không tìm thấy chủ đề.</p>
        <Button onClick={() => router.push("/practice/writing")}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-400 to-blue-500 rounded-xl shadow-lg">
              <Edit3 className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-4xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
              Luyện Viết TOEIC
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Rèn luyện khả năng viết câu, email và đoạn văn theo chuẩn TOEIC thực
            tế. Phát triển kỹ năng viết với phản hồi AI và kiểm tra ngữ pháp tự
            động.
          </p>
        </motion.div>

        {topic.imageUrl && (
          <div className="mb-8">
            <Image
              src={topic.imageUrl}
              alt={topic.name}
              width={1200}
              height={400}
              className="w-full h-56 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {/* List of subtopics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topic.subTopics.map((sub) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card
                className={`bg-gradient-to-br ${sub.gradient} border shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#23085A]">
                    <sub.icon className="w-5 h-5" />
                    {sub.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm mb-3">
                    {sub.description}
                  </p>
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>
                      Tiến độ: {sub.progress}/{sub.total}
                    </span>
                    <span>{sub.level}</span>
                  </div>
                  <Progress value={(sub.progress / sub.total) * 100} />
                  <div className="mt-4 text-right">
                    <Link href={`/practice/writing/${slug}/topics/${sub.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2 text-[#23085A] border-[#23085A]/30 hover:bg-[#23085A] hover:text-white"
                      >
                        <span>Luyện tập</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
