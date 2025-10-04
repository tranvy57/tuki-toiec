"use client";

import { m, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { Unit, Lesson } from "../../../types/type-lesson-mock";

import { SidebarUnits } from "./sidebar-units";
import { useSidebar } from "@/hooks/use-side-bar";
import {
  MOCK_LESSONS,
  MOCK_UNITS,
} from "@/app/(toeic)/study-plan/[id]/constants";
import { MobileDrawer, MobileMenuButton } from "./mobile-navigation";
import { SidebarToggle } from "@/app/(toeic)/study-plan/[id]/page";
import { Skeleton } from "@/components/ui/skeleton";
import { HeaderBreadcrumb } from "./header-breadcrumb";
import { ContentPane } from "./content-pane";
import { findLessonByType } from "@/app/(toeic)/study-plan/[id]/exercise-lessons";
import { UnitLessons } from "./unit-lessons";

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
  activeUnitId: number;
  setActiveUnitId: (id: number) => void;
  setActiveLessonId: (id: number | null) => void;
  lessons: (typeof MOCK_LESSONS)[1];
  activeLessonId: number | null;
  activeUnit: (typeof MOCK_UNITS)[0] | undefined;
  isLessonMode?: boolean;
  onStartLesson?: (lessonId: number) => void;
  onBackToLessonSelection?: () => void;
  type?: string;
}) {
  const { collapsed, setMobileOpen } = useSidebar();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile menu button */}
      <MobileMenuButton />

      {/* Mobile drawer */}
      <MobileDrawer>
        <SidebarUnits
          units={MOCK_UNITS}
          activeUnitId={activeUnitId}
          onSelectUnit={(id) => {
            setActiveUnitId(id);
            setActiveLessonId(null);
            setMobileOpen(false);
          }}
        />
      </MobileDrawer>

      {/* Desktop sidebar - collapsible */}
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
            units={MOCK_UNITS}
            activeUnitId={activeUnitId}
            onSelectUnit={(id) => {
              setActiveUnitId(id);
              setActiveLessonId(null);
            }}
          />
        </div>
      </m.aside>

      {/* Middle panel - lessons */}
      <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto hidden md:block">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Bài học</h2>
          {lessons.length > 0 ? (
            <UnitLessons
              lessons={lessons}
              activeLessonId={activeLessonId}
              onSelectLesson={setActiveLessonId}
            />
          ) : (
            <div className="space-y-2">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          )}
        </div>
      </div>

      {/* Content panel */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto">
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

          <ContentPane
            lessonId={!isLessonMode ? activeLessonId : undefined}
            selectedLesson={
              activeLessonId
                ? lessons.find((l) => l.id === activeLessonId)
                : null
            }
            onStartLesson={
              onStartLesson ? (lesson) => onStartLesson(lesson.id!) : undefined
            }
            isLessonMode={isLessonMode}
            exerciseLesson={
              isLessonMode && activeLessonId
                ? findLessonByType(type || "vocab_flashcard") || null
                : null
            }
          />
        </div>
      </main>
    </div>
  );
}
