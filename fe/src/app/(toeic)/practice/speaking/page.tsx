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
} from "lucide-react";
import Link from "next/link";

// Mock data cho các loại bài tập nói
const speakingExerciseTypes = [
  {
    id: "1",
    name: "Read Aloud",
    vietnameseName: "Đọc đoạn văn",
    slug: "read-aloud",
    description:
      "Đọc to đoạn văn hiển thị trên màn hình với phát âm chính xác và tự nhiên.",
    icon: Mic,
    difficulty: "Easy",
    difficultyColor: "bg-green-100 text-green-800",
    order: 1,
    exerciseCount: 20,
    duration: "15-20 giây",
    gradient: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200",
    accentColor: "text-blue-600",
    sample_exercise: {
      prompt:
        "The company will introduce a new training program for employees next month.",
      duration: 20,
      difficulty: "easy",
      sample_result: {
        transcript:
          "The company introduce a new training program for employees next month.",
        accuracy_score: 85,
        pronunciation_score: 78,
        feedback: "You missed 'will'. Focus on verb forms and linking sounds.",
      },
    },
  },
  {
    id: "2",
    name: "Repeat Sentence",
    vietnameseName: "Nhắc lại câu",
    slug: "repeat-sentence",
    description:
      "Nghe một câu ngắn và lặp lại chính xác với tốc độ và ngữ điệu phù hợp.",
    icon: Repeat,
    difficulty: "Easy",
    difficultyColor: "bg-green-100 text-green-800",
    order: 2,
    exerciseCount: 25,
    duration: "10-15 giây",
    gradient: "from-green-50 to-emerald-50",
    borderColor: "border-green-200",
    accentColor: "text-green-600",
    sample_exercise: {
      audio_url: "/audio/sample1.mp3",
      target_transcript: "The project has been completed ahead of schedule.",
      duration: 15,
      difficulty: "easy",
      sample_result: {
        transcript: "The project been completed ahead schedule.",
        accuracy_score: 83,
        feedback: "You missed 'has' and 'of'. Try slowing down a little.",
      },
    },
  },
  {
    id: "3",
    name: "Describe a Picture",
    vietnameseName: "Mô tả hình ảnh",
    slug: "describe-picture",
    description:
      "Quan sát hình ảnh và nói mô tả chi tiết những gì bạn nhìn thấy trong 30 giây.",
    icon: ImageIcon,
    difficulty: "Medium",
    difficultyColor: "bg-yellow-100 text-yellow-800",
    order: 3,
    exerciseCount: 15,
    duration: "30 giây",
    gradient: "from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
    accentColor: "text-purple-600",
    sample_exercise: {
      image_url: "/images/airport_waiting.jpg",
      prompt: "Look at the picture. Describe what you see.",
      duration: 30,
      difficulty: "medium",
      sample_feedback: {
        grammar_score: 89,
        fluency_score: 84,
        feedback:
          "Good pronunciation. Try adding more descriptive vocabulary like 'busy' or 'crowded'.",
      },
    },
  },
];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-24 h-24 bg-blue-400/10 rounded-full blur-xl"
        animate={{
          y: [0, -25, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-32 h-32 bg-pink-400/10 rounded-full blur-xl"
        animate={{
          y: [0, 25, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-pink-500 rounded-2xl shadow-xl">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
              Luyện Viết TOEIC
            </h1>
          </div>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Rèn luyện phát âm, phản xạ và diễn đạt tự nhiên qua 3 dạng bài cơ
            bản. Nhận phản hồi tức thì từ AI để cải thiện kỹ năng nói tiếng Anh.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-white/60">
              <Mic className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                Speech-to-Text
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-white/60">
              <Zap className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium text-gray-700">
                Phản hồi tức thì
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-white/60">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">
                Đánh giá chính xác
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-white/60">
              <Headphones className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                Âm thanh chất lượng
              </span>
            </div>
          </div>
        </motion.div>

        {/* Exercise Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {speakingExerciseTypes.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              variants={itemVariants}
              onMouseEnter={() => setHoveredCard(exercise.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group"
            >
              <motion.div
                whileHover={{
                  scale: 1.03,
                  y: -8,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                <Card
                  className={`h-full bg-gradient-to-br ${exercise.gradient} border-2 ${exercise.borderColor} shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden group-hover:border-opacity-60`}
                >
                  <CardHeader className="pb-2 relative">
                    {/* Icon container */}
                    <div className="flex items-center gap-3 ">
                      <div
                        className={`p-4 bg-white/90 rounded-2xl shadow-lg border ${exercise.borderColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                      >
                        <exercise.icon
                          className={`w-8 h-8 ${exercise.accentColor}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                          {exercise.vietnameseName}
                        </CardTitle>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          {exercise.name}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5 pb-6">
                    <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">
                      {exercise.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Target className="w-4 h-4" />
                          <span>Bài tập</span>
                        </div>
                        <span className="font-medium text-gray-700">
                          {exercise.exerciseCount}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>Thời gian</span>
                        </div>
                        <span className="font-medium text-gray-700">
                          {exercise.duration}
                        </span>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="bg-white/70 rounded-xl p-4 border border-white/50 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-600">
                          Tiến độ học tập
                        </span>
                        <span className="text-xs text-gray-500">
                          0/{exercise.exerciseCount}
                        </span>
                      </div>
                      <div className="w-full bg-white/80 rounded-full h-2.5 shadow-inner">
                        <motion.div
                          className={`bg-gradient-to-r from-blue-400 to-pink-400 h-2.5 rounded-full transition-all duration-700 ${
                            hoveredCard === exercise.id ? "w-1/4" : "w-0"
                          }`}
                        />
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Link
                      href={`/practice/speaking/${exercise.slug}`}
                      className="w-full"
                    >
                      <Button
                        className="w-full bg-white/90 hover:bg-white text-gray-800 hover:text-gray-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] border border-white/60 rounded-xl py-6"
                        size="lg"
                      >
                        <Mic className="mr-2 w-5 h-5" />
                        <span>Bắt đầu luyện tập</span>
                        <ArrowRight
                          className={`ml-2 w-5 h-5 transition-all duration-300 ${
                            hoveredCard === exercise.id
                              ? "translate-x-1 scale-110"
                              : ""
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

        {/* Bottom Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-20"
        >
          <Card className="bg-gradient-to-r from-blue-50 via-white to-pink-50 border-2 border-blue-100 shadow-xl rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-pink-500 rounded-xl shadow-lg">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">
                Mẹo luyện tập hiệu quả
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Bước 1: Khởi động
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Bắt đầu với <strong>Read Aloud</strong> để làm quen với phát
                  âm và nhịp điệu tiếng Anh.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  Bước 2: Phản xạ
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Luyện <strong>Repeat Sentence</strong> để cải thiện khả năng
                  nghe và phản xạ nhanh.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Bước 3: Sáng tạo
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Thử thách với <strong>Describe Picture</strong> để phát triển
                  kỹ năng diễn đạt tự do.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                💡 <strong>Lưu ý:</strong> Hãy đảm bảo môi trường yên tĩnh và
                microphone hoạt động tốt để có kết quả đánh giá chính xác nhất.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
