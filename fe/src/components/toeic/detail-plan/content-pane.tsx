"use client";

import { m } from "framer-motion";
import {
  BookOpen,
  MessageSquare,
  Headphones,
  Mic,
  Grid3x3,
  Clock,
  Play,
  CheckCircle,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/utils";
import { Lesson } from "../../../types/type-lesson-mock";
import { useState } from "react";
import { LessonRenderer } from "@/components/exercises/lesson-render";
import {
  Lesson as ExerciseLesson,
  AnswerResult,
  LessonSummary,
} from "@/types/type-exercise";

const LESSON_ICONS = {
  vocab: BookOpen,
  quiz: MessageSquare,
  match: Grid3x3,
  listen: Headphones,
  dict: Mic,
};

// Animation variants
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
};

const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

interface ContentPaneProps {
  selectedLesson: Lesson | null;
  onStartLesson: (lesson: Lesson) => void;
  exerciseLesson?: ExerciseLesson | null;
  isLessonMode?: boolean;
}

export function ContentPane({
  lessonId,
  selectedLesson,
  onStartLesson,
  exerciseLesson,
  isLessonMode = false,
}: {
  lessonId?: number | null;
  selectedLesson?: Lesson | null;
  onStartLesson?: (lesson: Lesson) => void;
  exerciseLesson?: ExerciseLesson | null;
  isLessonMode?: boolean;
}) {
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Handle lesson mode with exercises
  if (isLessonMode && exerciseLesson) {
    const handleItemAnswer = (result: AnswerResult) => {
      console.log("Answer result:", result);
    };

    const handleLessonComplete = (summary: LessonSummary) => {
      console.log("Lesson completed:", summary);
      // You can add navigation back to lesson selection or show completion modal
    };

    return (
      <m.div
        variants={slideInRight}
        initial="initial"
        animate="animate"
        className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="p-6">
          <LessonRenderer
            lesson={exerciseLesson}
            onItemAnswer={handleItemAnswer}
            onLessonComplete={handleLessonComplete}
          />
        </div>
      </m.div>
    );
  }

  // Handle lesson selection mode
  if (selectedLesson && onStartLesson) {
    const Icon =
      LESSON_ICONS[selectedLesson.type as keyof typeof LESSON_ICONS] ||
      BookOpen;
    const isCompleted = selectedLesson.status === "completed";
    const isLocked = selectedLesson.locked;
    const isInProgress = selectedLesson.status === "in_progress";

    return (
      <m.div
        key={selectedLesson.id}
        variants={slideInRight}
        initial="initial"
        animate="animate"
        className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{selectedLesson.title}</h1>
                {isCompleted && <CheckCircle className="w-6 h-6" />}
                {isLocked && <Lock className="w-6 h-6" />}
                {isInProgress && <Play className="w-6 h-6" />}
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {selectedLesson.duration || "N/A"}
                  </span>
                </div>
                <span className="text-sm capitalize">
                  Bài học {selectedLesson.type}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Progress indicator */}
          {!isLocked && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Tiến độ
                </span>
                <span className="text-sm text-slate-500">
                  {isCompleted ? "100%" : isInProgress ? "45%" : "0%"}
                </span>
              </div>
              <Progress
                value={isCompleted ? 100 : isInProgress ? 45 : 0}
                className="h-2"
              />
            </div>
          )}

          {/* Lesson description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Về bài học này
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {selectedLesson.type.includes("vocab") &&
                "Học các từ vựng quan trọng và ý nghĩa của chúng. Luyện tập phát âm và cách sử dụng trong ngữ cảnh."}
              {selectedLesson.type.includes("grammar") &&
                "Kiểm tra kiến thức với các câu hỏi tương tác. Nhận phản hồi và giải thích ngay lập tức."}
              {selectedLesson.type.includes("listen") &&
                "Luyện tập kỹ năng nghe hiểu với các bài tập âm thanh. Cải thiện khả năng nghe."}
              {selectedLesson.type.includes("read") &&
                "Luyện tập đọc hiểu với các bài tập đọc. Cải thiện kỹ năng đọc và hiểu văn bản."}
            </p>
          </div>

          {/* Learning objectives */}
          <div className="mb-8">
            <h3 className="text-md font-semibold text-slate-900 mb-3">
              Mục tiêu học tập
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2" />
                <span className="text-slate-600 text-sm">
                  Nắm vững từ vựng và cụm từ quan trọng
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2" />
                <span className="text-slate-600 text-sm">
                  Cải thiện kỹ năng hiểu nghe
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2" />
                <span className="text-slate-600 text-sm">
                  Luyện tập ứng dụng thực tế
                </span>
              </li>
            </ul>
          </div>

          {/* Action button */}
          <div className="flex gap-3">
            {isLocked ? (
              <Button disabled className="px-8">
                <Lock className="w-4 h-4 mr-2" />
                Đã khóa
              </Button>
            ) : isCompleted ? (
              <Button
                variant="outline"
                className="px-8"
                onClick={() => onStartLesson(selectedLesson)}
              >
                <Play className="w-4 h-4 mr-2" />
                Ôn tập bài học
              </Button>
            ) : (
              <Button
                className="px-8 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => onStartLesson(selectedLesson)}
              >
                <Play className="w-4 h-4 mr-2" />
                {isInProgress ? "Tiếp tục bài học" : "Bắt đầu bài học"}
              </Button>
            )}
          </div>
        </div>
      </m.div>
    );
  }

  // Legacy mode for lessonId
  if (!selectedLesson && !exerciseLesson && lessonId) {
    // Demo content based on lesson type
    const lessonType = Math.floor(lessonId / 100);

    const handleAnswer = (correct: boolean) => {
      setIsCorrect(correct);
      setTimeout(() => setIsCorrect(null), 600);
    };

    return (
      // Crossfade animation: opacity + slight translateY
      <m.div
        key={lessonId}
        initial={{ opacity: 0, y: 6 }}
        animate={{
          opacity: 1,
          y: 0,
          scale:
            isCorrect === true
              ? [1, 1.03, 1]
              : isCorrect === false
              ? [1, 1.03, 1]
              : 1,
        }}
        transition={{ duration: 0.2 }}
        style={{ willChange: "transform, opacity" }}
        className={cn(
          "h-full p-6 rounded-xl transition-colors duration-120",
          isCorrect === true && "bg-green-50",
          isCorrect === false && "bg-red-50"
        )}
      >
        {lessonType === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Thẻ từ vựng
            </h2>
            <div className="bg-white p-8 rounded-xl ring-1 ring-slate-200 text-center">
              <p className="text-4xl mb-4">👋</p>
              <p className="text-2xl font-medium text-slate-900 mb-2">Hello</p>
              <p className="text-slate-600">
                Lời chào được sử dụng khi gặp ai đó
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-150"
              >
                Tôi biết từ này
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 py-3 px-4 bg-slate-200 text-slate-900 rounded-xl font-medium hover:bg-slate-300 transition-colors duration-150"
              >
                Vẫn đang học
              </button>
            </div>
          </div>
        )}

        {lessonType === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Câu hỏi trắc nghiệm
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-slate-900">"Hello" có nghĩa là gì?</p>
              {["Lời chào", "Lời tạm biệt", "Câu hỏi", "Thán từ"].map(
                (option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i === 0)}
                    className="w-full text-left p-4 bg-white rounded-xl ring-1 ring-slate-200 hover:ring-indigo-300 hover:bg-indigo-50 transition-all duration-150"
                  >
                    {option}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {lessonType === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Bài tập chính tả
            </h2>
            <div className="bg-white p-8 rounded-xl ring-1 ring-slate-200">
              <div className="flex items-center justify-center mb-6">
                <button className="p-6 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors duration-150">
                  <Headphones className="w-8 h-8 text-indigo-600" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Nhập những gì bạn nghe được..."
                className="w-full p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={() => handleAnswer(true)}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-150"
            >
              Kiểm tra đáp án
            </button>
          </div>
        )}
      </m.div>
    );
  }

  // Default fallback - no lesson selected
  return (
    <m.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="flex-1 flex items-center justify-center bg-slate-50 rounded-2xl"
    >
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          Chọn một bài học
        </h3>
        <p className="text-slate-500 text-sm">
          Chọn một bài học từ thanh bên để bắt đầu học tập
        </p>
      </div>
    </m.div>
  );
}
