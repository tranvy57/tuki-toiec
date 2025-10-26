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
  Mic,
  Repeat,
  Image as ImageIcon,
  ArrowRight,
  Volume2,
  Clock,
  Target,
  Headphones,
  Zap,
  Sparkles,
  Edit3,
  Check,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { speakingExerciseTypes } from "@/data/mockMenuSpeaking";
import { CustomCard } from "@/components/CustomCard";
import { PracticeBreadcrumb } from "@/components/practice/PracticeBreadcrumb";

// Mock data cho các loại bài tập nói

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function SpeakingPracticePage() {
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
        {/* Breadcrumb */}
        <PracticeBreadcrumb
          items={[
            { label: "Speaking" }
          ]}
        />

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
            <h1 className="text-4xl md:text-3xl font-bold text-[#23085A]">
              Speaking
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

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Exercise Cards Grid */}

          {speakingExerciseTypes.map((exercise, i) => (
            <CustomCard
              key={exercise.slug}
              slug={exercise.slug}
              name={exercise.name}
              description={exercise.description}
              imageUrl={exercise.imageUrl}
              icon={exercise.icon}
              href={`/practice/speaking/${exercise.slug}`}
            />
          ))}
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
