"use client";

import { MainSidebar } from "@/components/toeic/detail-plan";
import { SidebarProvider } from "@/hooks/use-side-bar";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLatestCourse, useCourseById } from "@/api/usePlan";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTypeLesson, MOCK_LESSONS, MOCK_UNITS } from "./constants";
import { usePremiumStatus } from "@/api";

export default function CoursePage() {
  const [activeUnitId, setActiveUnitId] = useState<string>("1");
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [type, setType] = useState("");
  const [isLessonMode, setIsLessonMode] = useState(false);

  // Fetch course data from API
  const { data: courseData, isLoading, error, refetch } = useLatestCourse();
  const { data, isLoading: isLoadingPremium, error: premiumError } = usePremiumStatus();

  // Transform API data to match component expectations
  const transformApiDataToUnits = (course: any) => {
    if (!course?.phases) return MOCK_UNITS;

    return course.phases.map((phase: any, index: number) => ({
      id: parseInt(phase.id) || index + 1, // Convert to number for compatibility
      title: phase.title,
      progress: calculatePhaseProgress(phase),
    }));
  };

  const transformApiDataToLessons = (course: any, phaseId: number) => {
    if (!course?.phases)
      return MOCK_LESSONS[phaseId as keyof typeof MOCK_LESSONS] || [];

    const phase = course.phases.find(
      (p: any) => parseInt(p.id) === phaseId || p.id === phaseId
    );
    if (!phase?.phaseLessons) return [];

    return phase.phaseLessons.map((phaseLesson: any, index: number) => ({
      id: phaseId * 100 + index + 1, // Generate unique numeric ID
      type: determineLessonType(phaseLesson.lesson.contents),
      title: phaseLesson.lesson.name,
      done: phaseLesson.lesson.status === "completed",
      status: phaseLesson.lesson.status || "locked",
      duration: `${phaseLesson.lesson.contents?.length || 1} nội dung`,
      unitId: phaseId,
      description: phaseLesson.lesson.description,
      level: phaseLesson.lesson.level,
      contents: phaseLesson.lesson.contents,
    }));
  };

  const calculatePhaseProgress = (phase: any) => {
    if (!phase.phaseLessons?.length) return 0;
    const completed = phase.phaseLessons.filter((pl: any) =>
      pl.lesson.contents?.some((c: any) => c.status === "completed")
    ).length;
    return Math.round((completed / phase.phaseLessons.length) * 100);
  };

  const determineLessonType = (contents: any[]) => {
    if (!contents?.length) return "vocab_flashcard";
    const firstContent = contents[0];
    switch (firstContent.type) {
      case "vocabulary":
        return "vocab_flashcard";
      case "quiz":
        return "grammar_cloze";
      case "video":
        return "listening";
      case "strategy":
        return "grammar_formula";
      default:
        return "vocab_flashcard";
    }
  };

  // Use API data if available, fallback to mock data
  const units = courseData ? transformApiDataToUnits(courseData) : MOCK_UNITS;
  // const lessons = courseData
  //   ? transformApiDataToLessons(courseData, activeUnitId)
  //   : MOCK_LESSONS[activeUnitId as keyof typeof MOCK_LESSONS] || [];
  const activeUnit = units.find((u) => u.id === activeUnitId);

  // Debug: Log the course data structure
  // useEffect(() => {
  //   if (courseData) {
  //     console.log("📚 Course Data from API:", courseData);
  //     console.log("🎯 Transformed Units:", units);
  //     console.log("📖 Current Lessons:", lessons);
  //   }
  // }, [courseData, units, lessons]);

  // Set default active unit when data loads
  // useEffect(() => {
  //   if (courseData?.phases?.length) {
  //     const firstPhaseId = parseInt(courseData.phases[0].id) || 1;
  //     if (
  //       !courseData.phases.find((p: any) => parseInt(p.id) === activeUnitId)
  //     ) {
  //       setActiveUnitId(firstPhaseId);
  //       setActiveLessonId(null);
  //     }
  //   }
  // }, [courseData, activeUnitId]);

  const handleStartLesson = (lessonId: string) => {
    // setActiveLessonId(lessonId);
    setType(getTypeLesson(lessonId)?.type || "");
    setIsLessonMode(true);
  };

  const handleBackToLessonSelection = () => {
    setIsLessonMode(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <div>
            <p className="text-lg font-semibold mb-2">Không thể tải khóa học</p>
            <p className="text-red-600 mb-4">
              {error?.message || "Vui lòng thử lại sau"}
            </p>
            <Button onClick={() => refetch()}>Thử lại</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <LazyMotion features={domAnimation}>
        <MotionConfig reducedMotion="user">
          <MainSidebar
            activeUnitId={activeUnitId}
            setActiveUnitId={setActiveUnitId}
            setActiveLessonId={setActiveLessonId}
            lessons={[]}
            activeLessonId={activeLessonId}
            activeUnit={activeUnit}
            isLessonMode={isLessonMode}
            onStartLesson={handleStartLesson}
            onBackToLessonSelection={handleBackToLessonSelection}
            type={type}
          />
        </MotionConfig>
      </LazyMotion>
    </SidebarProvider>
  );
}
