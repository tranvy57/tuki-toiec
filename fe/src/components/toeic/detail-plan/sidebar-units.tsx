"use client";

import { PlanPhase } from "@/api/usePlan";
import { useSidebar } from "@/hooks/use-side-bar";
import { cn } from "@/utils";
import { m } from "framer-motion";
import {
  BookOpen,
  Grid3x3,
  Headphones,
  MessageSquare,
  Mic,
  Lock,
  Play,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const LESSON_ICONS = {
  vocab: BookOpen,
  quiz: MessageSquare,
  match: Grid3x3,
  listen: Headphones,
  dict: Mic,
};

const PHASE_STATUS_ICONS = {
  locked: Lock,
  current: Play,
  completed: CheckCircle2,
};

const PHASE_STATUS_COLORS = {
  locked: "text-gray-400 bg-gray-50",
  current: "text-indigo-600 bg-indigo-50",
  completed: "text-green-600 bg-green-50",
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
  units: PlanPhase[];
  activeUnitId: string;
  onSelectUnit: (id: string) => void;
}

export function SidebarUnits({
  units,
  activeUnitId,
  onSelectUnit,
}: SidebarUnitsProps) {
  const { collapsed } = useSidebar();
  
  const getStatusBadge = (status: string) => {
    
    const variants = {
      completed: "default",
      current: "secondary",
      locked: "outline",
    } as const;

    const labels = {
      completed: "Hoàn thành",
      current: "Đang học",
      locked: "Khóa",
    };

    return (
      <Badge
        variant={variants[status as keyof typeof variants] || "outline"}
        className="text-xs"
      >
        {labels[status as keyof typeof labels] || "Khóa"}
      </Badge>
    );
  };

  return (
    <m.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-2"
    >
      {units.map((unit) => {
        const isActive = unit.id === activeUnitId;
        const StatusIcon =
          PHASE_STATUS_ICONS[unit.status as keyof typeof PHASE_STATUS_ICONS] ||
          Lock;
        const statusColor =
          PHASE_STATUS_COLORS[
            unit.status as keyof typeof PHASE_STATUS_COLORS
          ] || "text-gray-400 bg-gray-50";
        const isLocked = unit.status === "locked";

        return (
          <m.button
            key={unit.id}
            variants={fadeInUp}
            onClick={() => !isLocked && onSelectUnit(unit.id)}
            whileHover={!isLocked ? { scale: 1.01 } : {}}
            whileTap={!isLocked ? { scale: 0.98 } : {}}
            transition={{ duration: 0.15 }}
            style={{ willChange: "transform, opacity" }}
            disabled={isLocked}
            className={cn(
              "w-full text-left rounded-xl transition-colors duration-150 relative group",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              isActive && "bg-indigo-50 ring-1 ring-indigo-200",
              !isActive &&
                !isLocked &&
                "hover:bg-slate-50 hover:ring-1 hover:ring-slate-200",
              isLocked && "opacity-60 cursor-not-allowed",
              collapsed ? "my-3" : "p-3"
            )}
            aria-selected={isActive}
            aria-current={isActive ? "page" : undefined}
            aria-disabled={isLocked}
            title={collapsed ? unit.title : undefined}
          >
            {collapsed ? (
              <div className="flex items-center justify-center">
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors duration-150",
                    statusColor
                  )}
                >
                  <StatusIcon className="w-4 h-4" />
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={cn(
                      "p-2 rounded-lg transition-colors duration-150",
                      statusColor
                    )}
                  >
                    <StatusIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 text-sm mb-1 truncate">
                      {unit.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {unit.phaseLessons?.length || 0} bài học
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 mt-1">
                  {getStatusBadge(unit.status)}
                </div>
              </div>
            )}
          </m.button>
        );
      })}
    </m.div>
  );
}
