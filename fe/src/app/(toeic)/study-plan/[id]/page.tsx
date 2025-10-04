"use client";


import {
  MainSidebar
} from "@/components/toeic/detail-plan";
import { SidebarProvider, useSidebar } from "@/hooks/use-side-bar";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import {
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { useState } from "react";
import { getTypeLesson, MOCK_LESSONS, MOCK_UNITS } from "./constants";
import { set } from "zod";

export function SidebarToggle() {
  const { collapsed, toggle } = useSidebar();

  return (
    <button
      onClick={toggle}
      aria-expanded={!collapsed}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      title={
        collapsed ? "Expand sidebar (Ctrl+\\)" : "Collapse sidebar (Ctrl+\\)"
      }
    >
      {collapsed ? (
        <PanelLeftOpen className="w-5 h-5 text-slate-600" />
      ) : (
        <PanelLeftClose className="w-5 h-5 text-slate-600" />
      )}
    </button>
  );
}

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
