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
  Image,
  Mail,
  BookOpen,
  Edit3,
  ArrowRight,
  Sparkles,
  Clock,
  Target,
} from "lucide-react";
import Link from "next/link";

// Mock data cho các loại bài tập viết
const writingExerciseTypes = [
  {
    id: "1",
    name: "Mô tả hình ảnh",
    slug: "describe-picture",
    description: "Viết 5 câu mô tả dựa trên hình ảnh cho sẵn",
    icon: Image,
    difficulty: "Easy",
    difficultyColor: "bg-green-100 text-green-800",
    order: 1,
    exerciseCount: 25,
    estimatedTime: "10-15 phút",
    gradient: "from-green-50 to-emerald-50",
    borderColor: "border-green-200",
  },
  {
    id: "2",
    name: "Trả lời email",
    slug: "email-response",
    description: "Viết phản hồi cho một email về công việc hoặc yêu cầu",
    icon: Mail,
    difficulty: "Medium",
    difficultyColor: "bg-yellow-100 text-yellow-800",
    order: 2,
    exerciseCount: 18,
    estimatedTime: "15-20 phút",
    gradient: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200",
  },
  {
    id: "3",
    name: "Viết đoạn nêu quan điểm",
    slug: "opinion-essay",
    description: "Viết đoạn văn 150-200 từ nêu quan điểm cá nhân về một chủ đề",
    icon: BookOpen,
    difficulty: "Hard",
    difficultyColor: "bg-red-100 text-red-800",
    order: 3,
    exerciseCount: 12,
    estimatedTime: "25-30 phút",
    gradient: "from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
  },
  {
    id: "4",
    name: "Sửa câu sai",
    slug: "grammar-fix",
    description: "Sửa lỗi ngữ pháp trong câu đã cho",
    icon: Edit3,
    difficulty: "Easy",
    difficultyColor: "bg-green-100 text-green-800",
    order: 4,
    exerciseCount: 30,
    estimatedTime: "5-10 phút",
    gradient: "from-orange-50 to-amber-50",
    borderColor: "border-orange-200",
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

export default function WritingPracticePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
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

      <div className="container mx-auto px-4 py-12 relative z-10">
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

        {/* Exercise Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-full mx-auto"
        >
          {writingExerciseTypes.map((exercise) => (
            <motion.div
              key={exercise.id}
              variants={itemVariants}
              onMouseEnter={() => setHoveredCard(exercise.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`h-full bg-gradient-to-br ${exercise.gradient} border ${exercise.borderColor} shadow-md hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden group`}
                >
                  <CardHeader className="">
                    {/* <div className="flex items-start justify-between mb-3">
                      <Badge
                        className={`${exercise.difficultyColor} border-0 font-medium px-3 py-1`}
                      >
                        {exercise.difficulty}
                      </Badge>
                    </div> */}
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors flex items-center gap-3">
                      <div
                        className={`p-3 bg-white/80 rounded-lg shadow-sm border ${exercise.borderColor} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <exercise.icon className="w-6 h-6 text-gray-700" />
                      </div>
                      {exercise.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4 pb-4">
                    <p className="text-gray-600 leading-relaxed text-sm h-12">
                      {exercise.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Target className="w-4 h-4" />
                        <span>{exercise.exerciseCount} bài tập</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{exercise.estimatedTime}</span>
                      </div>
                    </div>

                    {/* Progress placeholder */}
                    <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-600">
                          Tiến độ
                        </span>
                        <span className="text-xs text-gray-500">
                          0/{exercise.exerciseCount}
                        </span>
                      </div>
                      <div className="w-full bg-white/80 rounded-full h-2">
                        <div className="bg-gradient-to-r from-pink-400 to-blue-500 h-2 rounded-full w-0 transition-all duration-300" />
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Link
                      href={`/practice/writing/${exercise.slug}`}
                      className="w-full"
                    >
                      <Button
                        className="w-full bg-white/90 hover:bg-white text-gray-800 hover:text-gray-900 font-semibold shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02] border border-white/50"
                        size="lg"
                      >
                        <span>Bắt đầu luyện tập</span>
                        <ArrowRight
                          className={`ml-2 w-4 h-4 transition-transform duration-300 ${
                            hoveredCard === exercise.id ? "translate-x-1" : ""
                          }`}
                        />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
