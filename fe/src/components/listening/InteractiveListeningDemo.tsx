"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Edit,
  Eye,
  Headphones,
  MessageSquare,
  Mic,
  Play,
  Volume2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomCard } from "../CustomCard";

// Mock data for different question types
const mockMCQQuestions = [
  {
    id: "mcq-1",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    questionText: "What is the main topic of the conversation?",
    options: [
      { id: "a", text: "Planning a business meeting", isCorrect: true },
      { id: "b", text: "Discussing vacation plans", isCorrect: false },
      { id: "c", text: "Ordering food at a restaurant", isCorrect: false },
      { id: "d", text: "Talking about the weather", isCorrect: false },
    ],
    explanation:
      "The speakers are discussing the details of an upcoming business meeting, including the agenda and participants.",
    transcript:
      "A: We need to schedule the quarterly review meeting. B: Yes, let's make sure all department heads can attend.",
  },
];

const mockClozeQuestions = [
  {
    id: "cloze-1",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    text: "The meeting will start at {{time}} in the {{room}} room, and we expect about {{number}} people to attend.",
    blanks: [
      {
        id: "time",
        position: 0,
        correctAnswer: "9 AM",
        alternatives: ["9:00", "nine"],
      },
      {
        id: "room",
        position: 1,
        correctAnswer: "conference",
        alternatives: ["meeting"],
      },
      {
        id: "number",
        position: 2,
        correctAnswer: "twenty",
        alternatives: ["20"],
      },
    ],
    fullTranscript:
      "The meeting will start at 9 AM in the conference room, and we expect about twenty people to attend.",
    hint: "Listen for specific times, room names, and numbers.",
  },
];

const mockOrderingQuestions = [
  {
    id: "ordering-1",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    instructions:
      "Listen to the conversation and arrange the steps in the correct order:",
    sentences: [
      {
        id: "s1",
        text: "First, we'll review the quarterly reports",
        correctPosition: 0,
      },
      {
        id: "s2",
        text: "Then, we'll discuss the new marketing strategy",
        correctPosition: 1,
      },
      {
        id: "s3",
        text: "After that, we'll address budget concerns",
        correctPosition: 2,
      },
      {
        id: "s4",
        text: "Finally, we'll set goals for next quarter",
        correctPosition: 3,
      },
    ],
    explanation:
      "The conversation follows a logical progression from reviewing past performance to planning future goals.",
  },
];

const mockWordDiscriminationQuestions = [
  {
    id: "word-1",
    instructions: "Listen carefully and choose the word you hear:",
    targetWord: "ship",
    options: [
      {
        id: "w1",
        word: "ship",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        phonetic: "/ʃɪp/",
        isCorrect: true,
      },
      {
        id: "w2",
        word: "sheep",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        phonetic: "/ʃiːp/",
        isCorrect: false,
      },
    ],
    explanation:
      "Pay attention to the vowel sound: /ɪ/ in 'ship' vs /iː/ in 'sheep'",
  },
];

const mockDictationQuestions = [
  {
    id: "dictation-1",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    correctText: "The quick brown fox jumps over the lazy dog.",
    instructions: "Listen carefully and type exactly what you hear:",
    hint: "This sentence contains all letters of the alphabet.",
    maxReplays: 3,
    allowSlowPlayback: true,
  },
];

export const dataListening = [
  {
    id: "mcq",
    name: "Trắc nghiệm",
    image:
      "https://test-english.com/staging11/wp-content/uploads/A2%E2%80%93Test-2_Use-of-English.jpg",
    description: "Nghe và chọn đáp án đúng",
    icon: Headphones,
    color: "blue" as const,
    questions: mockMCQQuestions,
    type: "mcq" as const,
    href: "/practice/listening/mcq",
  },
  //   {
  //     id: "cloze",
  //     name: "Fill in the Blanks",
  //     description: "Listen and complete the missing words",
  //     icon: Edit,
  //     color: "green" as const,
  //     component: ClozeListening,
  //     questions: mockClozeQuestions,
  //     type: "cloze" as const,
  //   },
  // {
  //   id: "ordering",
  //   name: "Sentence Ordering",
  //   description: "Arrange sentences in the correct order",
  //   icon: List,
  //   color: "purple" as const,
  //   component: OrderingListening,
  //   questions: mockOrderingQuestions,
  //   type: "ordering" as const,
  // },
  // {
  //   id: "discrimination",
  //   name: "Word Discrimination",
  //   description: "Distinguish between similar sounds",
  //   icon: Volume2,
  //   color: "orange" as const,
  //   component: WordDiscrimination,
  //   questions: mockWordDiscriminationQuestions,
  //   type: "discrimination" as const,
  // },
  {
    id: "dictation",
    name: "Điền chính tả",
    description: "Nghe và gõ chính xác những gì bạn nghe được",
    icon: MessageSquare,
    color: "red" as const,
    questions: mockDictationQuestions,
    type: "dictation" as const,
    href: "/practice/listening/dictation",
  },
  {
    id: "cloze-enhanced",
    name: "Điền từ nâng cao",
    description: "Nghe và điền từ còn thiếu vào chỗ trống ",
    icon: Edit,
    color: "purple" as const,
    questions: [],
    type: "cloze-enhanced" as const,
    href: "/practice/listening/cloze",
  },
];

export default function InteractiveListeningDemo() {
  // Navigation is now handled in handleSelectExercise function

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
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

        <div className="">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className=""
          >
            <div className="flex items-center justify-start gap-3 mb-4">
              <div className="p-3  rounded-xl ">
                <Mic className="w-4 h-4 " />
              </div>
              <h1 className="text-2xl md:text-2xl font-bold text-[#23085A]">
                Listening
              </h1>
            </div>
            {/* Mô tả chính */}
            <p className="pb-4 text-lg">
              Phát triển khả năng diễn đạt ý tưởng rõ ràng, mạch lạc và tự nhiên
              theo chuẩn TOEIC. Với Tuki, bạn được luyện tập qua các bài viết mô
              phỏng đề thi thật, hệ thống sẽ tự động cá nhân hóa nội dung phù
              hợp với trình độ và mục tiêu điểm số của bạn.
            </p>
          </motion.div>

          {/* Exercise Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataListening.map((exercise, index) => {
              return (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* <Card
                    className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200 bg-white/80 backdrop-blur-sm"
                    onClick={() => handleSelectExercise(exercise.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`
                        w-12 h-12 rounded-xl flex items-center justify-center
                        ${
                          exercise.color === "blue"
                            ? "bg-blue-100 text-blue-600"
                            : ""
                        }
                        
                        ${
                          exercise.color === "purple"
                            ? "bg-purple-100 text-purple-600"
                            : ""
                        }
                        
                        ${
                          exercise.color === "red"
                            ? "bg-red-100 text-red-600"
                            : ""
                        }
                        group-hover:scale-110 transition-transform duration-300
                      `}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>

                      <CardTitle className="text-xl font-semibold text-slate-800 group-hover:text-slate-900">
                        {exercise.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-slate-600 mb-4 leading-relaxed">
                        {exercise.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {exercise.questions.length} question
                          {exercise.questions.length > 1 ? "s" : ""}
                        </Badge>

                        <div className="flex items-center text-xs text-slate-500">
                          <Volume2 className="h-3 w-3 mr-1" />
                          Audio included
                        </div>
                      </div>
                    </CardContent>
                  </Card> */}
                  <CustomCard
                    slug={exercise.id}
                    name={exercise.name}
                    description={exercise.description}
                    icon={exercise.icon}
                    href={exercise.href}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Volume2 className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  Interactive Audio
                </h3>
                <p className="text-slate-600 text-sm">
                  Advanced audio controls with replay limits and speed
                  adjustment
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  Instant Feedback
                </h3>
                <p className="text-slate-600 text-sm">
                  Real-time corrections with detailed explanations
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  Adaptive UI
                </h3>
                <p className="text-slate-600 text-sm">
                  Each exercise type has optimized interactions and animations
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
