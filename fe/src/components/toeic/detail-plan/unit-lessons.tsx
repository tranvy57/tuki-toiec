"use client";

import { MOCK_LESSONS } from "@/app/(toeic)/study-plan/[id]/constants";
import { cn } from "@/utils";
import { m } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Grid3x3,
  Headphones,
  Lock,
  MessageSquare,
  Mic
} from "lucide-react";
import { Lesson } from "../../../types/type-lesson-mock";

const LESSON_ICONS = {
  vocab_flashcard: BookOpen,
  vocab_listening: BookOpen,
  listening_mcq: Headphones,
  listening_cloze: Headphones,
  grammar_cloze: MessageSquare,
  grammar_formula: MessageSquare,
  reading_mcq: BookOpen,
};

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.15 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.02,
    },
  },
};

interface UnitLessonsProps {
  lessons: Lesson[];
  activeLessonId: number | null;
  onSelectLesson: (lessonId: number) => void;
}
 
export function UnitLessons({
  lessons,
  activeLessonId,
  onSelectLesson,
}: {
  lessons: (typeof MOCK_LESSONS)[1];
  activeLessonId: number | null;
  onSelectLesson: (id: number) => void;
}) {
  return (
    <m.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-2"
    >
      {lessons.map((lesson) => {
        const isActive = lesson.id === activeLessonId;
        const Icon = LESSON_ICONS[lesson.type as keyof typeof LESSON_ICONS];

        return (
          <m.button
            key={lesson.id}
            variants={fadeInUp}
            onClick={() => !lesson.locked && onSelectLesson(lesson.id)}
            whileHover={!lesson.locked ? { scale: 1.01 } : {}}
            whileTap={!lesson.locked ? { scale: 0.98 } : {}}
            transition={{ duration: 0.15 }}
            style={{ willChange: "transform, opacity" }}
            disabled={lesson.locked}
            className={cn(
              "w-full text-left p-3 rounded-xl transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              lesson.locked && "opacity-50 cursor-not-allowed",
              isActive && "bg-indigo-50 ring-1 ring-indigo-200",
              !isActive &&
                !lesson.locked &&
                "hover:bg-slate-50 hover:ring-1 hover:ring-slate-200"
            )}
            aria-selected={isActive}
            aria-disabled={lesson.locked}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg transition-colors duration-150",
                  isActive
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-slate-100 text-slate-600"
                )}
              >
                {lesson.locked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-900 text-sm truncate">
                  {lesson.title}
                </h4>
              </div>
              {lesson.done && (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              )}
            </div>
          </m.button>
        );
      })}
    </m.div>
  );
}
