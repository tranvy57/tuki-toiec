"use client";


import {
  MainSidebar
} from "@/components/toeic/detail-plan";
import { SidebarProvider } from "@/hooks/use-side-bar";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import { useState } from "react";
import { getTypeLesson, MOCK_LESSONS, MOCK_UNITS } from "./constants";


export default function CoursePage() {
  const [activeUnitId, setActiveUnitId] = useState(2);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(201);
  const [type, setType] = useState("");
  const [isLessonMode, setIsLessonMode] = useState(false);

  const activeUnit = MOCK_UNITS.find((u) => u.id === activeUnitId);
  const lessons = MOCK_LESSONS[activeUnitId as keyof typeof MOCK_LESSONS] || [];

  const handleStartLesson = (lessonId: number) => {
    setActiveLessonId(lessonId);
    setType(getTypeLesson(lessonId)?.type || "");
    setIsLessonMode(true);
  };

  const handleBackToLessonSelection = () => {
    setIsLessonMode(false);
  };

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
