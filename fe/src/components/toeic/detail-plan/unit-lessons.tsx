"use client";

import { cn } from "@/utils";
import { m, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  FileText,
  Grid3x3,
  Headphones,
  HelpCircle,
  Loader2,
  Lock,
  MessageSquare,
  Mic,
  PlayCircle,
  SkipForward,
  Video,
  ChevronDown,
  ChevronRight,
  Crown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Lesson } from "../../../types/type-lesson-mock";
import { PlanLesson, PlanContent } from "@/api/usePlan";

const LESSON_ICONS = {
  vocab_flashcard: BookOpen,
  vocab_listening: BookOpen,
  listening_mcq: Headphones,
  listening_cloze: Headphones,
  grammar_cloze: MessageSquare,
  grammar_formula: MessageSquare,
  reading_mcq: BookOpen,
};

export const LESSON_CONTENT_ICONS = {
  strategy: Brain,
  video: Video,
  quiz: HelpCircle,
  explanation: FileText,
  vocabulary: BookOpen,
} as const;

export const STUDY_TASK_STATUS_ICONS = {
  locked: Lock,
  pending: PlayCircle,
  in_progress: Loader2,
  completed: CheckCircle2,
  skipped: SkipForward,
} as const;

export const STUDY_TASK_STATUS_COLORS = {
  locked: "text-gray-400",
  pending: "text-blue-500",
  in_progress: "text-orange-500",
  completed: "text-green-500",
  skipped: "text-gray-500",
} as const;

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const contentSlide = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.2 },
};

interface UnitLessonsProps {
  lessons: PlanLesson[];
  activeLessonId: string | null;
  expandedLessons: Set<string>;
  onSelectLesson: (lessonId: string) => void;
  onSelectContent: (contentId: string, content?: any) => void;
  selectedContentId: string | null;
  isPremiumUser?: boolean;
}

// Helper component cho content item
function ContentItem({
  content,
  isSelected,
  onClick,
  isPremiumUser = false,
}: {
  content: PlanContent;
  isSelected: boolean;
  onClick: () => void;
  isPremiumUser?: boolean;
}) {
  const ContentIcon =
    LESSON_CONTENT_ICONS[content.type as keyof typeof LESSON_CONTENT_ICONS] ||
    FileText;

  const isPremiumLocked = content.isPremium && !isPremiumUser;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-2 rounded-lg transition-colors duration-150 group relative",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        isSelected
          ? "bg-indigo-100 border border-indigo-200"
          : "hover:bg-slate-50 border border-transparent",
        isPremiumLocked && "opacity-75 hover:opacity-90"
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "p-1.5 rounded-md transition-colors",
            isSelected
              ? "bg-indigo-200 text-indigo-700"
              : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
          )}
        >
          <ContentIcon className="w-3 h-3" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-700 truncate">
              {getContentTypeLabel(content.type)}
            </span>
            {content.isPremium && (
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs px-1.5 py-0.5 border-yellow-200",
                  isPremiumLocked
                    ? "bg-gray-100 text-gray-500"
                    : "bg-yellow-100 text-yellow-700"
                )}
              >
                <Crown className="w-2.5 h-2.5 mr-1" />
                Premium
              </Badge>
            )}
            {isPremiumLocked && <Lock className="w-3 h-3 text-gray-400" />}
          </div>
        </div>
      </div>
    </button>
  );
}

function getContentTypeLabel(type: string) {
  const labels = {
    strategy: "Chiến lược",
    video: "Video",
    quiz: "Bài tập",
    explanation: "Giải thích",
    vocabulary: "Từ vựng",
  };
  return labels[type as keyof typeof labels] || type;
}

export function UnitLessons({
  lessons,
  activeLessonId,
  expandedLessons,
  onSelectLesson,
  onSelectContent,
  selectedContentId,
  isPremiumUser = false,
}: UnitLessonsProps) {
  console.log(lessons);
  return (
    <m.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-2"
    >
      {lessons.map((lesson) => {
        console.log(lesson)
        const isActive = lesson.id === activeLessonId;
        const isExpanded = expandedLessons.has(lesson.id);
        const isLocked = lesson.studyTaskStatus === "locked";
        const StatusIcon =
          STUDY_TASK_STATUS_ICONS[
          lesson.studyTaskStatus as keyof typeof STUDY_TASK_STATUS_ICONS
          ];
        const statusColor =
          STUDY_TASK_STATUS_COLORS[
          lesson.studyTaskStatus as keyof typeof STUDY_TASK_STATUS_COLORS
          ];

        return (
          <m.div key={lesson.id}>
            {/* Lesson Header */}
            <button
              onClick={() => !isLocked && onSelectLesson(lesson.id)}
              disabled={isLocked}
              className={cn(
                "w-full text-left p-3 rounded-xl transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                isLocked && "opacity-50 cursor-not-allowed",
                isActive && "bg-indigo-50 ring-1 ring-indigo-200",
                !isActive &&
                !isLocked &&
                "hover:bg-slate-50 hover:ring-1 hover:ring-slate-200"
              )}
              aria-selected={isActive}
              aria-disabled={isLocked}
              aria-expanded={isExpanded}
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
                  <StatusIcon
                    className={cn(
                      "w-4 h-4",
                      statusColor,
                      lesson.studyTaskStatus === "in_progress" && "animate-spin"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-900 text-sm truncate">
                      {lesson.name}
                    </h4>
                    {!isLocked &&
                      lesson.contents &&
                      lesson.contents.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-500">
                            {lesson.contents.length}
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      )}
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {lesson.description}
                  </p>
                </div>
              </div>
            </button>

            {/* Lesson Contents - Collapsible */}
            <AnimatePresence>
              {isExpanded && (
                <m.div
                  {...contentSlide}
                  className="ml-6 mt-2 space-y-1 border-l-2 border-slate-100 pl-3"
                >
                  {/* Show real contents if available */}
                  {lesson.contents && lesson.contents.length > 0 &&
                    lesson.contents
                      .sort((a, b) => a.order - b.order)
                      .map((content) => (
                        <ContentItem
                          key={content.id}
                          content={content}
                          isSelected={selectedContentId === content.id}
                          onClick={() => onSelectContent(content.id, content)}
                          isPremiumUser={isPremiumUser}
                        />
                      ))
                  }

                  {/* Show mock contents for testing if no real contents */}
                  {/* {(!lesson.contents || lesson.contents.length === 0) &&
                    lesson.id === 201 && // Only for specific lesson for demo
                    MOCK_LESSON_CONTENTS.map((content) => (
                      <ContentItem
                        key={content.id}
                        content={content}
                        isSelected={selectedContentId === content.id}
                        onClick={() => onSelectContent(content.id, content)}
                        isPremiumUser={isPremiumUser}
                      />
                    ))
                  } */}
                </m.div>
              )}
            </AnimatePresence>
          </m.div>
        );
      })}
    </m.div>
  );
}
