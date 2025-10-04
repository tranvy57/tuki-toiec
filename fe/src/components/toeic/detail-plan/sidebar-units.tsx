"use client";

import { m } from "framer-motion";
import {
  BookOpen,
  MessageSquare,
  Headphones,
  Mic,
  Grid3x3,
} from "lucide-react";
import { cn } from "@/utils";
import { Unit } from "../../../types/type-lesson-mock";
import { useSidebar } from "@/hooks/use-side-bar";

const LESSON_ICONS = {
  vocab: BookOpen,
  quiz: MessageSquare,
  match: Grid3x3,
  listen: Headphones,
  dict: Mic,
};

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.18 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

interface SidebarUnitsProps {
  units: Unit[];
  activeUnitId: number;
  onSelectUnit: (id: number) => void;
}

export function SidebarUnits({
  units,
  activeUnitId,
  onSelectUnit,
}: SidebarUnitsProps) {
  const { collapsed } = useSidebar();

  return (
    <m.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-2"
    >
      {units.map((unit) => {
        const isActive = unit.id === activeUnitId;
        const Icon = LESSON_ICONS.vocab;

        return (
          <m.button
            key={unit.id}
            variants={fadeInUp}
            onClick={() => onSelectUnit(unit.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            style={{ willChange: "transform, opacity" }}
            className={cn(
              "w-full text-left rounded-xl transition-colors duration-150 relative group",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              // isActive
              //   ? "bg-slate-100 ring-1 ring-slate-200 p-0"
              //   : "hover:bg-slate-50 hover:ring-1 hover:ring-slate-200 py-2",
              collapsed ? "my-3" : "p-3"
            )}
            aria-selected={isActive}
            aria-current={isActive ? "page" : undefined}
            title={collapsed ? unit.title : undefined}
          >
            {collapsed ? (
              <div className="flex items-center justify-center">
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors duration-150",
                    isActive
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors duration-150",
                    isActive
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 text-sm mb-1 truncate">
                    {unit.title}
                  </h3>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <m.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: unit.progress / 100 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{
                        transformOrigin: "left",
                        willChange: "transform",
                      }}
                      className="h-full bg-indigo-600 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {unit.progress}% complete
                  </p>
                </div>
              </div>
            )}
          </m.button>
        );
      })}
    </m.div>
  );
}
