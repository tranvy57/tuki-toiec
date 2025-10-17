"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import Link from "next/link";
import { Check, Edit3 } from "lucide-react";

// Mock data tương tự phần bạn có
const writingExerciseTypes = [
  {
    slug: "describe-picture",
    name: "Mô tả hình ảnh",
    imageUrl: "https://static.athenaonline.vn//img.tmp/48%20edit.png",
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
        iamgeUrl:
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
    subTopics: [
      {
        id: "4-1",
        title: "Thì và động từ",
        description: "Tập trung sửa lỗi thì động từ và dạng V-ing/to V.",
        level: "Easy",
        progress: 5,
        total: 12,
        gradient: "from-amber-50 to-orange-50",
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

export default function WritingTopicsPage() {
  const params = useParams();
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const exercise = writingExerciseTypes.find((ex) => ex.slug === params.slug);

  if (!exercise)
    return (
      <div className="p-8 text-center text-gray-600">
        Không tìm thấy dạng bài.
      </div>
    );

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gray-50  px-6">
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
      {/* Header */}

      <div className="container mx-auto px-4 py-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className=""
        >
          <div className="flex mx-auto items-center justify-start gap-3 mb-4">
            <div className="p-3  rounded-xl ">
              <Edit3 className="w-4 h-4 " />
            </div>
            <h1 className="text-4xl md:text-3xl font-bold text-[#23085A]">
              Writting
            </h1>
          </div>

          <div className="flex item-start gap-6">
            <Image
              src={exercise.imageUrl}
              width={500}
              height={500}
              alt="hehe"
            />

            {exercise.instruction && (
              <div className="  ">
                <h3 className="text-lg font-semibold text-[#23085A] mb-2">
                  Hướng dẫn làm bài dạng {exercise.name.toLowerCase()}
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {exercise.instruction.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>

        <h1 className="text-4xl md:text-xl font-bold text-[#23085A] pb-4 mt-4">
          Danh sách chủ đề:
        </h1>

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className=" flex  gap-6 w-full mx-auto "
        >
          <div className="flex gap-6 flex-col w-[75%]">
            {exercise.subTopics.map((topic) => (
              <motion.div
                key={topic.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredCard(topic.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link
                  href={`/practice/writing/${exercise.slug}`}
                  className="block"
                >
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-stretch   transition-all duration-300 rounded-lg overflow-hidden group bg-white">
                      <div className=" flex flex-col justify-between border-l bg-white">
                        <Image
                          src={
                            topic.imageUrl ||
                            "https://working.vn/vnt_upload/news/hinh_ky_nang/H24-min.gif"
                          }
                          width={600}
                          height={600}
                          alt={exercise.name}
                          className="object-cover w-full h-40"
                        />

                        {/* <div className="p-4">
                      <Link href={`/practice/writing/${exercise.slug}/topics`}>
                        <Button
                          className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                          size="lg"
                        >
                          <span>Chọn chủ đề</span>
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                    </div> */}
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        {/* Header */}
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            {/* <div className="p-3 bg-gray-50 rounded-lg border shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <exercise.icon className="w-6 h-6 text-gray-700" />
                        </div> */}
                            <h3 className="text-xl font-semibold text-[#23085A]  group-hover:text-gray-800 transition-colors">
                              {topic.title}
                            </h3>
                          </div>

                          {/* Description */}
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {topic.description}
                          </p>

                          {/* Info */}
                          {/* <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Target className="w-4 h-4" />
                          <span>{exercise.exerciseCount} bài tập</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{exercise.estimatedTime}</span>
                        </div>
                      </div> */}
                        </div>
                        {/* Progress */}
                        {/* <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Tiến độ</span>
                        <span>0/{exercise.exerciseCount}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-gradient-to-r from-pink-400 to-blue-500 h-2 rounded-full w-0 transition-all duration-300" />
                      </div>
                    </div> */}
                      </div>

                      {/* RIGHT IMAGE + BUTTON */}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="p-4 round-sm bg-white bg-white  w-80">
            <h3 className="text-lg font-semibold text-[#23085A] mb-3">
              🎯 Các dạng khác
            </h3>
            <ul className="space-y-4 text-gray-800">
              {writingExerciseTypes.map((item) => {
                return (
                  <Link href={"abc"}>
                    <li className="flex items-start gap-2 hover:underline">
                      <Check className="w-5 h-5 text-[#23085A] mt-0.5" />
                      <span>{item?.name}</span>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
        </motion.div>
      </div>
      {/* Topics list */}
    </div>
  );
}
