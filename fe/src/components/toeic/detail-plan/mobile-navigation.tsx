"use client";

import { useSidebar } from "@/hooks/use-side-bar";
import { m } from "framer-motion";
import { PanelLeftOpen, X } from "lucide-react";
import { Lesson, Unit } from "../../../types/type-lesson-mock";

// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
  exit: { x: "-100%" },
};

interface MobileNavigationProps {
  units: Unit[];
  lessons: Record<number, Lesson[]>;
  activeUnitId: number;
  activeLessonId: number | null;
  onSelectUnit: (id: number) => void;
  onSelectLesson: (lesson: Lesson) => void;
  onBack: () => void;
  showingLessons: boolean;
  selectedUnit: Unit | null;
}

export function MobileMenuButton() {
  const { setMobileOpen } = useSidebar();

  return (
    <button
      onClick={() => setMobileOpen(true)}
      className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg hover:bg-slate-50 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      aria-label="Open menu"
    >
      <PanelLeftOpen className="w-5 h-5 text-slate-600" />
    </button>
  );
}

// Mobile drawer component
export function MobileDrawer({ children }: { children: React.ReactNode }) {
  const { mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Backdrop */}
      {mobileOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-900/50 z-40"
          style={{ willChange: "opacity" }}
        />
      )}

      {/* Drawer */}
      <m.aside
        initial={{ x: "-100%" }}
        animate={{ x: mobileOpen ? 0 : "-100%" }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{ willChange: "transform" }}
        className="md:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-slate-900">Chương học</h1>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          {children}
        </div>
      </m.aside>
    </>
  );
}
