"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import Link from "next/link";
import { Check, Edit3, Mic, Loader2, AlertCircle } from "lucide-react";
import { speakingExerciseTypes } from "@/data/mockMenuSpeaking";
import { CustomCard } from "@/components/CustomCard";
import { PracticeBreadcrumb } from "@/components/practice/PracticeBreadcrumb";
import { useLessonsByModality } from "@/api/useLessons";
import { useSpeakingHistory } from "@/store/speaking-history-store";
import { SpeakingHistoryButton, SpeakingHistoryDialog } from "@/lib/speaking-history-index";
// Mock data tương tự phần bạn có
// const speakingExerciseTypes = [
//   {
//     slug: "describe-picture",
//     name: "Mô tả hình ảnh",
//     imageUrl: "https://static.athenaonline.vn//img.tmp/48%20edit.png",
//     instruction: [
//       "Quan sát bức ảnh cẩn thận: xác định bối cảnh, đối tượng chính và hành động trong hình.",
//       "Bắt đầu bằng câu giới thiệu tổng quát (e.g. 'The picture shows...').",
//       "Sử dụng thì hiện tại tiếp diễn (Present Continuous) để mô tả hành động đang diễn ra.",
//       "Tập trung vào các yếu tố chính: người, vật, địa điểm, và hoạt động.",
//       "Tránh liệt kê rời rạc — hãy kết nối các câu mô tả bằng logic tự nhiên.",
//       "Kiểm tra lại ngữ pháp và chính tả sau khi viết.",
//     ],
//     subTopics: [
//       {
//         id: "1-1",
//         title: "Địa điểm công cộng",
//         description:
//           "Luyện viết mô tả các địa điểm như công viên, thư viện, nhà hàng...",

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

//         level: "Medium",
//         progress: 0,
//         total: 7,
//         gradient: "from-emerald-50 to-teal-50",
//       },
//     ],
//   },
//   {
//     slug: "email-response",
//     name: "Trả lời email",
//     imageUrl:
//       "https://media-blog.jobsgo.vn/blog/wp-content/uploads/2022/06/cach-viet-email-dung-chuan.jpg",
//     instruction: [
//       "Đọc kỹ yêu cầu của đề để xác định mục tiêu email (phản hồi, yêu cầu, xác nhận...).",
//       "Bắt đầu bằng lời chào lịch sự phù hợp với ngữ cảnh (Dear Mr./Ms...).",
//       "Mở đầu ngắn gọn, giới thiệu lý do viết email.",
//       "Trả lời từng điểm của đề, sử dụng câu ngắn gọn, rõ ràng.",
//       "Kết thúc bằng lời cảm ơn và câu kết lịch sự (e.g. 'I look forward to your reply.').",
//       "Tránh viết quá dài, dùng giọng điệu chuyên nghiệp và lịch thiệp.",
//     ],
//     subTopics: [
//       {
//         id: "2-1",
//         title: "Giao tiếp công việc",
//         description: "Phản hồi email từ đồng nghiệp hoặc cấp trên.",
//         imageUrl:
//           "https://media-blog.jobsgo.vn/blog/wp-content/uploads/2025/09/tra-loi-email-tham-gia-phong-van-image-1.jpg",
//         level: "Medium",
//         progress: 3,
//         total: 10,
//         gradient: "from-blue-50 to-cyan-50",
//       },
//       {
//         id: "2-2",
//         title: "Sắp lịch và lời mời",
//         description: "Viết email đặt lịch, mời họp, hoặc xác nhận tham dự.",
//         imageUrl:
//           "https://www.nhanlucdaiduong.com.vn/uploads/email-tu-choi-phong-van-5.jpg",
//         level: "Easy",
//         progress: 0,
//         total: 8,
//         gradient: "from-sky-50 to-blue-50",
//       },
//       {
//         id: "2-3",
//         title: "Phản hồi khách hàng",
//         iamgeUrl:
//           "https://www.shutterstock.com/image-photo/two-businesswomen-handshake-agreement-smiling-600nw-2658451829.jpg",
//         description: "Trả lời câu hỏi, khiếu nại hoặc xác nhận đơn hàng.",
//         level: "Hard",
//         progress: 1,
//         total: 6,
//         gradient: "from-indigo-50 to-blue-50",
//       },
//     ],
//   },
//   {
//     slug: "opinion-essay",
//     name: "Viết đoạn nêu quan điểm",
//     imageUrl:
//       "https://dotb.vn/wp-content/uploads/2024/08/Ket-qua-hoc-tap-cua-hoc-sinh-thong-bao-ket-qua-hoc-tap-dotb.jpg",
//     subTopics: [
//       {
//         id: "3-1",
//         title: "Công nghệ và đời sống",
//         description:
//           "Viết về tác động của công nghệ trong công việc và cuộc sống.",

//         level: "Medium",
//         progress: 0,
//         total: 6,
//         gradient: "from-purple-50 to-pink-50",
//       },
//       {
//         id: "3-2",
//         title: "Giáo dục và học tập",
//         description:
//           "Trình bày quan điểm về học online, bằng cấp, kỹ năng mềm.",
//         level: "Hard",
//         progress: 0,
//         total: 5,
//         gradient: "from-pink-50 to-fuchsia-50",
//       },
//       {
//         id: "3-3",
//         title: "Môi trường và xã hội",
//         description: "Nêu ý kiến về bảo vệ môi trường và trách nhiệm cá nhân.",
//         level: "Medium",
//         progress: 0,
//         total: 4,
//         gradient: "from-fuchsia-50 to-rose-50",
//       },
//     ],
//   },
//   {
//     slug: "grammar-fix",
//     name: "Sửa câu sai",
//     imageUrl:
//       "https://ila.edu.vn/wp-content/uploads/2023/03/ila-ngu-phap-tieng-anh-co-ban-cho-hoc-sinh-tieu-hoc-3.jpg",
//     subTopics: [
//       {
//         id: "4-1",
//         title: "Thì và động từ",
//         description: "Tập trung sửa lỗi thì động từ và dạng V-ing/to V.",
//         level: "Easy",
//         progress: 5,
//         total: 12,
//         gradient: "from-amber-50 to-orange-50",
//       },
//       {
//         id: "4-2",
//         title: "Giới từ và danh từ",
//         description: "Sửa lỗi dùng sai giới từ, danh từ số ít/số nhiều.",
//         level: "Medium",
//         progress: 2,
//         total: 10,
//         gradient: "from-orange-50 to-yellow-50",
//       },
//       {
//         id: "4-3",
//         title: "Cấu trúc phức tạp",
//         description:
//           "Chỉnh lỗi trong câu điều kiện, mệnh đề quan hệ, câu ghép.",
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

export default function SpeakingTopicsPage() {
  const params = useParams();
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const slug = params.slug as string;
  const { isHistoryDialogVisible, hideHistoryDialog } = useSpeakingHistory();

  // Fetch API data for read_aloud
  const { data: readAloudLessons, isLoading: readAloudLoading, error: readAloudError } = useLessonsByModality({
    modality: "read_aloud",
    skillType: "speaking",
    enabled: slug === "read-aloud"
  });

  // Fetch API data for describe_picture
  const { data: describePictureLessons, isLoading: describePictureLoading, error: describePictureError } = useLessonsByModality({
    modality: "describe_picture",
    skillType: "speaking",
    enabled: slug === "describe-picture"
  });

  // Fetch API data for respond_using_info
  const { data: respondUsingInfoLessons, isLoading: respondUsingInfoLoading, error: respondUsingInfoError } = useLessonsByModality({
    modality: "respond_using_info",
    skillType: "speaking",
    enabled: slug === "respond-using-info"
  });

  // Fetch API data for express_opinion
  const { data: expressOpinionLessons, isLoading: expressOpinionLoading, error: expressOpinionError } = useLessonsByModality({
    modality: "express_opinion",
    skillType: "speaking",
    enabled: slug === "express-opinion"
  });

  const exercise = speakingExerciseTypes.find((ex) => ex.slug === slug);

  // Show loading for API-backed exercises
  if ((slug === "read-aloud" && readAloudLoading) || (slug === "describe-picture" && describePictureLoading) || (slug === "respond-using-info" && respondUsingInfoLoading) || (slug === "express-opinion" && expressOpinionLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Đang tải danh sách bài tập...</h2>
        </div>
      </div>
    );
  }

  // Show error for API-backed exercises
  if ((slug === "read-aloud" && readAloudError) || (slug === "describe-picture" && describePictureError) || (slug === "respond-using-info" && respondUsingInfoError) || (slug === "express-opinion" && expressOpinionError)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Không thể tải danh sách bài tập</h2>
          <p className="text-gray-500 mb-4">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="p-8 text-center text-gray-600">
        Không tìm thấy dạng bài.
      </div>
    );
  }

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
      {/* Breadcrumb and History Button */}
      <div className="container mx-auto pt-6">
        <div className="flex items-center justify-between mb-4">
          <PracticeBreadcrumb
            items={[
              { label: "Speaking", href: "/practice/speaking" },
              { label: exercise?.name || 'Bài tập' }
            ]}
          />
          {/* <SpeakingHistoryButton
          skill=""
          topicId=""
          /> */}
        </div>
      </div>

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
              <Mic className="w-4 h-4 " />
            </div>
            <h1 className="text-4xl md:text-2xl font-bold text-[#23085A]">
              Speaking
            </h1>
          </div>

          <div className="flex item-start gap-6 bg-white p-4 rounded-md">
            <Image
              src={exercise.imageUrl}
              width={300}
              height={500}
              alt="hehe"
            />

            {exercise && (
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
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {slug === "read-aloud" && readAloudLessons ? (
              // Render API data for read-aloud
              readAloudLessons.flatMap(lesson =>
                lesson.items.map((item) => (
                  <CustomCard
                    key={item.id}
                    slug={item.id}
                    name={item.title}
                    description={`${item.difficulty} - Band ${item.bandHint}`}
                    imageUrl={item.promptJsonb?.image_url}
                    icon={Mic}
                    href={`/practice/speaking/${exercise.slug}/${item.id}`}
                  />
                ))
              )
            ) : slug === "describe-picture" && describePictureLessons ? (
              // Render API data for describe-picture
              describePictureLessons.flatMap(lesson =>
                lesson.items.map((item) => (
                  <CustomCard
                    key={item.id}
                    slug={item.id}
                    name={item.title}
                    description={`${item.difficulty} - Band ${item.bandHint}`}
                    imageUrl={item.promptJsonb?.image_url}
                    icon={Mic}
                    href={`/practice/speaking/${exercise.slug}/${item.id}`}
                  />
                ))
              )
            ) : slug === "respond-using-info" && respondUsingInfoLessons ? (
              // Render API data for respond-using-info (by lesson, not individual items)
              respondUsingInfoLessons.map((lesson, index) => (
                <CustomCard
                  key={lesson.lessonId}
                  slug={lesson.lessonId}
                  name={`Lesson ${index + 1}`}
                  description={`${lesson.items.length} câu hỏi - Questions ${lesson.items.map(item => item.promptJsonb?.question_number).join(', ')}`}
                  imageUrl="https://img.freepik.com/free-vector/customer-support-flat-design-illustration_23-2148889374.jpg"
                  icon={Mic}
                  href={`/practice/speaking/${exercise.slug}/${lesson.lessonId}`}
                />
              ))
            ) : slug === "express-opinion" && expressOpinionLessons ? (
              // Render API data for express-opinion (by lesson, not individual items)
              expressOpinionLessons.map((lesson, index) => (
                <CustomCard
                  key={lesson.lessonId}
                  slug={lesson.lessonId}
                  name={`Lesson ${index + 1}`}
                  description={`${lesson.items.length} câu hỏi - Questions ${lesson.items.map(item => item.promptJsonb?.question_number).join(', ')}`}
                  imageUrl="/images/express-opinion-placeholder.jpg"
                  icon={Mic}
                  href={`/practice/speaking/${exercise.slug}/${lesson.lessonId}`}
                />
              ))
            ) : (
              // Render mock data for other types
              exercise?.subTopics?.map((topic) => (
                <CustomCard
                  key={topic.id}
                  slug={topic.id}
                  name={topic.title}
                  description={topic.description}
                  imageUrl={topic.imageUrl}
                  icon={topic.icon}
                  href={`/practice/speaking/${exercise.slug}/${topic.id}`}
                />
              ))
            )}
          </div>
        </motion.div>
      </div>
      {/* Topics list */}

      {/* Speaking History Dialog */}
      <SpeakingHistoryDialog
        open={isHistoryDialogVisible}
        onOpenChange={(open) => !open && hideHistoryDialog()}
        skillFilter={slug}
      />
    </div>
  );
}
