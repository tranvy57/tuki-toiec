"use client";

import { BandPickerDialog } from "@/components/toeic/study-plan/band-picker-dialog";
import { PhaseOverview } from "@/components/toeic/study-plan/phase-overview";
import { ReviewTestWizard } from "@/components/toeic/study-plan/review-test-wizard";
import { UpgradeProSheet } from "@/components/toeic/study-plan/upgrade-pro-sheet";
import { MainSidebar } from "@/components/toeic/detail-plan";
import { SidebarProvider } from "@/hooks/use-side-bar";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import { useMyPlan, useLatestCourse } from "@/api/usePlan";
import { usePremiumStatus } from "@/api";
import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTypeLesson, MOCK_LESSONS, MOCK_UNITS } from "./constants";

type OnboardingStep = "band" | "test" | "overview" | "course";

export default function LearnPage() {
  const [step, setStep] = useState<OnboardingStep>("band");
  const [targetBand, setTargetBand] = useState<string>("");
  const [testResults, setTestResults] = useState<any>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Course page states
  const [activeUnitId, setActiveUnitId] = useState<string>("1");
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [type, setType] = useState("");
  const [isLessonMode, setIsLessonMode] = useState(false);

  // API calls
  const {
    data: myPlan,
    isLoading: isPlanLoading,
    error: planError,
  } = useMyPlan();

  const {
    data: latestCourse,
    isLoading: isCourseLoading,
    error: courseError,
  } = useLatestCourse();

  const { data: premiumData, isLoading: isLoadingPremium, error: premiumError } = usePremiumStatus();

  // Effect to determine initial step based on plan status
  useEffect(() => {
    if (!isPlanLoading && !isCourseLoading) {
      if (latestCourse) {
        // User has a course, go to course page
        setStep("course");
      } else if (myPlan) {
        // User has a plan but no course, go to overview with plan data
        setStep("overview");
        setTargetBand(myPlan?.band?.toString() || "750");
        setTestResults(myPlan); // Pass the entire plan as results
      } else {
        // User doesn't have plan or course, start with review test
        setStep("test");
        setTargetBand("750"); // Default band
      }
    }
  }, [myPlan, latestCourse, isPlanLoading, isCourseLoading]);

  const handleBandSelected = (band: string) => {
    setTargetBand(band);
    setStep("test");
  };

  const handleTestComplete = (results: any) => {
    setTestResults(results);
    setStep("overview");
  };

  // Helper functions for course page
  const transformApiDataToUnits = (course: any) => {
    if (!course?.phases) return MOCK_UNITS;

    return course.phases.map((phase: any, index: number) => ({
      id: parseInt(phase.id) || index + 1,
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
      id: phaseId * 100 + index + 1,
      type: determineLessonType(phaseLesson.lesson.contents),
      title: phaseLesson.lesson.name,
      done: phaseLesson.lesson.status === "completed",
      premium: false,
      description: `Lesson ${index + 1} description`,
    }));
  };

  const calculatePhaseProgress = (phase: any) => {
    if (!phase?.phaseLessons?.length) return 0;
    const completed = phase.phaseLessons.filter(
      (pl: any) => pl.lesson.status === "completed"
    ).length;
    return Math.round((completed / phase.phaseLessons.length) * 100);
  };

  const determineLessonType = (contents: any[]) => {
    if (!contents?.length) return "reading";
    return contents[0]?.type || "reading";
  };

  const units = transformApiDataToUnits(latestCourse);
  const activeUnit = units.find((u) => u.id.toString() === activeUnitId);
  const lessons = transformApiDataToLessons(latestCourse, parseInt(activeUnitId));

  // Reset lesson state when switching units
  useEffect(() => {
    setActiveLessonId(null);
    setIsLessonMode(false);
  }, [activeUnitId]);

  const handleStartLesson = (lessonId: string) => {
    setType(getTypeLesson(lessonId)?.type || "");
    setIsLessonMode(true);
  };

  const handleBackToLessonSelection = () => {
    setIsLessonMode(false);
  };

  // Loading state
  if (isPlanLoading || isCourseLoading || isLoadingPremium) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải kế hoạch học...</p>
        </div>
      </div>
    );
  }

  // Error state for course page
  if (step === "course" && courseError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <div>
            <p className="text-lg font-semibold mb-2">Không thể tải khóa học</p>
            <p className="text-red-600 mb-4">
              {courseError?.message || "Vui lòng thử lại sau"}
            </p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        </div>
      </div>
    );
  }

  // Error state for other cases
  if (planError || courseError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600">Có lỗi xảy ra khi tải dữ liệu</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Render course page if user has a course
  if (step === "course") {
    return (
      <SidebarProvider>
        <LazyMotion features={domAnimation}>
          <MotionConfig reducedMotion="user">
            <MainSidebar
              activeUnitId={activeUnitId}
              setActiveUnitId={setActiveUnitId}
              setActiveLessonId={setActiveLessonId}
              lessons={lessons}
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

  return (
    <div className="min-h-screen">
      {step === "band" && (
        <BandPickerDialog
          open={true}
          onBandSelected={handleBandSelected}
          latestCourse={latestCourse || undefined}
        />
      )}

      {step === "test" && (
        <ReviewTestWizard
          targetBand={targetBand}
          onComplete={handleTestComplete}
          latestCourse={latestCourse || undefined}
        />
      )}

      {step === "overview" && (
        <>
          <PhaseOverview
            testResults={testResults}
            studyPlan={myPlan || undefined}
            latestCourse={latestCourse || undefined}
            onUpgradeClick={() => setShowUpgrade(true)}
          />
          <UpgradeProSheet
            open={showUpgrade}
            onOpenChange={setShowUpgrade}
            studyPlan={myPlan || undefined}
          />
        </>
      )}
    </div>
  );
}
