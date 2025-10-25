"use client";

import { m, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Crown,
  FileText,
  Video,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils";
import { Unit, Lesson } from "../../../types/type-lesson-mock";
import { useState, useEffect } from "react";

import { SidebarUnits } from "./sidebar-units";
import { useSidebar } from "@/hooks/use-side-bar";
import {
  MOCK_LESSONS,
  MOCK_UNITS,
  MOCK_LESSON_CONTENTS,
} from "@/app/(toeic)/study-plan/constants";
import { MobileDrawer, MobileMenuButton } from "./mobile-navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { HeaderBreadcrumb } from "./header-breadcrumb";
import { ContentPane } from "./content-pane";
import { findLessonByType } from "@/app/(toeic)/study-plan/[id]/exercise-lessons";
import { LessonContentLearningInterface } from "@/components/learning";
import { UnitLessons, LESSON_CONTENT_ICONS } from "./unit-lessons";
import { SidebarToggle } from "./sidebar-toggle";
import { useLatestCourse } from "@/api/usePlan";
import { PremiumUpgradeDialog } from "@/components/premium/prenium-upgrade";
import { usePremiumStatus } from "@/api";

export function MainSidebar({
  activeUnitId,
  setActiveUnitId,
  setActiveLessonId,
  lessons,
  activeLessonId,
  activeUnit,
  isLessonMode = false,
  onStartLesson,
  onBackToLessonSelection,
  type,
}: {
  activeUnitId: string;
  setActiveUnitId: (id: string) => void;
  setActiveLessonId: (id: string | null) => void;
  lessons: (typeof MOCK_LESSONS)[1];
  activeLessonId: string | null;
  activeUnit: (typeof MOCK_UNITS)[0] | undefined;
  isLessonMode?: boolean;
  onStartLesson?: (lessonId: string) => void;
  onBackToLessonSelection?: () => void;
  type?: string;
}) {
  const { collapsed, setMobileOpen } = useSidebar();
  const { data: courseData, isLoading, error, refetch } = useLatestCourse();
  const { data: premiumData } = usePremiumStatus();
  console.log(premiumData?.isPremium)

  // State cho content panel
  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    null
  );
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set()
  );

  // State cho premium upgrade dialog
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [premiumContentType, setPremiumContentType] = useState<string>("");

  const isPremiumUser = premiumData?.isPremium || false;

  // Lấy active phase và lesson
  const activePhase = courseData?.phases?.find(
    (p) => p.id.toString() === activeUnitId.toString()
  );

  const hasLessons = !!activePhase?.phaseLessons?.length;
  const activeLesson = activePhase?.phaseLessons?.find(
    (pl) => pl.lesson.id === activeLessonId
  )?.lesson;
  const selectedContent = activeLesson?.contents?.find(
    (c) => c.id === selectedContentId
  );

  const toggleLessonExpansion = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  const handleLessonClick = (lessonId: string) => {
    if (activeLessonId === lessonId) {
      // Nếu đã active thì toggle expansion
      toggleLessonExpansion(lessonId);
    } else {
      // Select lesson mới và expand nó
      setActiveLessonId(lessonId);
      setExpandedLessons(new Set([lessonId]));
      setSelectedContentId(null); // Reset content selection
    }
  };

  const handleContentClick = (contentId: string, content?: any) => {
    // Kiểm tra nếu content là premium và user chưa premium
    if (content?.isPremium && !isPremiumUser) {
      setPremiumContentType(content.type || "content");
      setShowPremiumDialog(true);
      return;
    }

    setSelectedContentId(contentId);
  };

  // Reset states when activeUnitId changes
  useEffect(() => {
    setActiveLessonId(null);
    setSelectedContentId(null);
    setExpandedLessons(new Set());
  }, [activeUnitId, setActiveLessonId]);

  const lessonList = hasLessons ? (
    <UnitLessons
      lessons={activePhase?.phaseLessons?.map((pl) => pl.lesson) || []}
      activeLessonId={activeLessonId}
      expandedLessons={expandedLessons}
      onSelectLesson={handleLessonClick}
      onSelectContent={handleContentClick}
      selectedContentId={selectedContentId}
      isPremiumUser={isPremiumUser}
    />
  ) : (
    <div className="space-y-2">
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile menu button */}
      <MobileMenuButton />

      {/* Mobile drawer */}
      <MobileDrawer>
        <SidebarUnits
          units={courseData?.phases || []}
          activeUnitId={activeUnitId.toString()}
          onSelectUnit={(id) => {
            setActiveUnitId(id);
            setActiveLessonId(null);
            setSelectedContentId(null);
            setExpandedLessons(new Set());
            setMobileOpen(false);
          }}
        />
      </MobileDrawer>

      {/* Cột 1: Phase List - Desktop sidebar */}
      <m.aside
        initial={false}
        animate={{
          width: collapsed ? "4rem" : "18rem",
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{ willChange: "width" }}
        className="hidden md:block bg-white border-r border-slate-200 sticky top-0 h-screen overflow-y-auto overflow-x-hidden"
      >
        <div className="p-6">
          <div
            className={cn(
              "flex items-center mb-6",
              collapsed ? "justify-center" : "justify-between"
            )}
          >
            {!collapsed && (
              <h1 className="text-xl font-semibold text-slate-900">
                Chương học
              </h1>
            )}
            <SidebarToggle />
          </div>
          <SidebarUnits
            units={courseData?.phases || []}
            activeUnitId={activeUnitId}
            onSelectUnit={(id) => {
              setActiveUnitId(id);
              setActiveLessonId(null);
              setSelectedContentId(null);
              setExpandedLessons(new Set());
            }}
          />
        </div>
      </m.aside>

      {/* Cột 2: Lesson List */}
      <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto hidden md:block">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Bài học</h2>
          {lessonList}
        </div>
      </div>

      {/* Cột 3: Content Detail Panel */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-72px)]">
          {activeUnit && !isLessonMode && (
            <HeaderBreadcrumb unitTitle={activeUnit.title} />
          )}

          {isLessonMode && onBackToLessonSelection && (
            <div className="mb-6">
              <button
                onClick={onBackToLessonSelection}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Quay lại danh sách bài học
              </button>
            </div>
          )}

          {/* Content Display */}
          {selectedContent ? (
            <ContentDetailPanel
              content={selectedContent}
              isPremiumUser={isPremiumUser}
            />
          ) : activeLesson ? (
            <LessonOverviewPanel lesson={activeLesson} />
          ) : activePhase ? (
            <PhaseOverviewPanel phase={activePhase} />
          ) : (
            <EmptyStatePanel />
          )}
        </div>
      </main>

      {/* Premium Upgrade Dialog */}
      <PremiumUpgradeDialog
        open={showPremiumDialog}
        onOpenChange={setShowPremiumDialog}
        contentType={premiumContentType}
      />
    </div>
  );
}

// Component để hiển thị chi tiết content
function ContentDetailPanel({
  content,
  isPremiumUser = false,
}: {
  content: any;
  isPremiumUser?: boolean;
}) {
  const [showLearningInterface, setShowLearningInterface] = useState(false);

  const ContentIcon =
    LESSON_CONTENT_ICONS[content.type as keyof typeof LESSON_CONTENT_ICONS] ||
    FileText;

  const getContentTypeLabel = (type: string) => {
    const labels = {
      strategy: "Chiến lược",
      video: "Video",
      quiz: "Bài tập",
      explanation: "Giải thích",
      vocabulary: "Từ vựng",
    };
    return labels[type as keyof typeof labels] || type;
  };

  // Check if content has interactive learning elements
  const hasVocabularies = content.vocabularies && content.vocabularies.length > 0;
  const hasItems = content.lessonContentItems && content.lessonContentItems.length > 0;
  const isInteractiveContent = hasVocabularies || (hasItems && content.type === "quiz");

  // Show learning interface if requested
  if (showLearningInterface && isInteractiveContent) {
    return (
      <LessonContentLearningInterface
        contentData={{
          id: content.id,
          type: content.type,
          content: content.content,
          order: content.order,
          isPremium: content.isPremium,
          vocabularies: content.vocabularies,
          lessonContentItems: content.lessonContentItems,
        }}
        isPremiumUser={isPremiumUser}
        onBack={() => setShowLearningInterface(false)}
        onComplete={(stats) => {
          console.log("Learning completed:", stats);
          setShowLearningInterface(false);
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
          <ContentIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {getContentTypeLabel(content.type)}
          </h3>
          {content.isPremium && (
            <Badge
              variant="secondary"
              className="mt-1 bg-yellow-100 text-yellow-700 border-yellow-200"
            >
              <Crown className="w-3 h-3 mr-1" />
              Premium Content
            </Badge>
          )}
        </div>
      </div>

      {/* Premium Content Blur Overlay */}
      {content.isPremium && !isPremiumUser ? (
        <div className="relative">
          <div className="prose max-w-none blur-sm pointer-events-none">
            {content.type === "video" ? (
              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Video className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500">Video Player</p>
                </div>
              </div>
            ) : content.type === "quiz" ? (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <HelpCircle className="w-5 h-5 text-blue-600 mb-2" />
                <h4 className="font-medium text-blue-900 mb-2">
                  Bài tập trắc nghiệm
                </h4>
              </div>
            ) : null}
            <p className="text-slate-700 whitespace-pre-wrap">
              {content.content}
            </p>
          </div>

          {/* Premium Overlay */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">
                Nội dung Premium
              </h4>
              <p className="text-slate-600 text-sm mb-4">
                Nâng cấp lên Premium để mở khóa nội dung này
              </p>
              <Button
                size="sm"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
              >
                Nâng cấp ngay
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="prose max-w-none">
          {content.type === "video" ? (
            <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <Video className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500">Video Player</p>
              </div>
            </div>
          ) : content.type === "quiz" ? (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <HelpCircle className="w-5 h-5 text-blue-600 mb-2" />
              <h4 className="font-medium text-blue-900 mb-2">
                Bài tập trắc nghiệm
              </h4>
            </div>
          ) : null}

          <p className="text-slate-700 whitespace-pre-wrap">
            {content.content}
          </p>

          {/* Interactive Learning Button */}
          {isInteractiveContent && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium text-indigo-900">
                    Bài học tương tác
                  </span>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  {hasVocabularies && `${content.vocabularies.length} từ vựng để học`}
                  {hasItems && `${content.lessonContentItems.length} bài tập để thực hành`}
                </p>
                <Button
                  onClick={() => setShowLearningInterface(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {hasVocabularies ? "Học từ vựng" : "Làm bài tập"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Component để hiển thị tổng quan lesson
function LessonOverviewPanel({ lesson }: { lesson: any }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {lesson.name}
      </h3>
      <p className="text-slate-600 mb-4">{lesson.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-sm text-slate-500">Cấp độ</p>
          <p className="font-medium text-slate-900">{lesson.level}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-sm text-slate-500">Nội dung</p>
          <p className="font-medium text-slate-900">
            {lesson.contents?.length || 0} mục
          </p>
        </div>
      </div>

      <p className="text-slate-600 text-center">
        👈 Chọn một nội dung bên trái để bắt đầu học
      </p>
    </div>
  );
}

// Component để hiển thị tổng quan phase
function PhaseOverviewPanel({ phase }: { phase: any }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {phase.title}
      </h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 p-3 rounded-lg text-center">
          <p className="text-sm text-slate-500">Trạng thái</p>
          <p className="font-medium text-slate-900">{phase.status}</p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg text-center">
          <p className="text-sm text-slate-500">Bài học</p>
          <p className="font-medium text-slate-900">
            {phase.phaseLessons?.length || 0}
          </p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg text-center">
          <p className="text-sm text-slate-500">Thứ tự</p>
          <p className="font-medium text-slate-900">#{phase.order}</p>
        </div>
      </div>

      <p className="text-slate-600 text-center">
        👈 Chọn một bài học bên trái để xem chi tiết
      </p>
    </div>
  );
}

// Component empty state
function EmptyStatePanel() {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 text-center">
      <div className="text-slate-400 mb-4">
        <BookOpen className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        Chọn một chương để bắt đầu
      </h3>
      <p className="text-slate-500">
        Chọn chương học từ danh sách bên trái để xem các bài học
      </p>
    </div>
  );
}
