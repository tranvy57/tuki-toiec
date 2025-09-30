"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Phase } from "@/types/study-plan";
import {
  getPhaseStatusColor,
  isPhaseAccessible,
  getPhaseDescription,
} from "@/libs/study-plan-data";
import { Play, Lock, CheckCircle, ArrowRight, BookOpen, Clock } from "lucide-react";
import { cn } from "@/utils/libs";

interface PhaseNodeProps {
  phase: Phase;
  index: number;
  isLeft: boolean;
  onPhasePress: (phaseId: string) => void;
  onPhaseStart: (phaseId: string) => void;
}

export function PhaseNode({
  phase,
  index,
  isLeft,
  onPhasePress,
  onPhaseStart,
}: PhaseNodeProps) {
  const isAccessible = isPhaseAccessible(phase.status);
  const lessonDescription = getPhaseDescription(phase.lessons.length);
  
  // Mock progress data
  const completedLessons = phase.status === "completed" ? phase.lessons.length 
    : phase.status === "active" ? Math.floor(phase.lessons.length * 0.3) 
    : 0;
  const progressPercentage = (completedLessons / phase.lessons.length) * 100;

  const getStatusConfig = () => {
    switch (phase.status) {
      case "completed":
        return {
          icon: <CheckCircle className="h-6 w-6" />,
          color: "text-white bg-green-500",
          badge: "Hoàn thành",
          badgeClass: "bg-green-100 text-green-700 border-green-200"
        };
      case "active":
        return {
          icon: <Play className="h-6 w-6" />,
          color: "text-white bg-toeic-primary",
          badge: "Khả dụng",
          badgeClass: "bg-orange-100 text-orange-700 border-orange-200"
        };
      default:
        return {
          icon: <Lock className="h-6 w-6" />,
          color: "text-gray-500 bg-gray-200",
          badge: "Đã khóa", 
          badgeClass: "bg-gray-100 text-gray-600 border-gray-200"
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="relative mb-8 w-full">
      {/* Connecting Line */}
      {index > 0 && (
        <div className="absolute left-1/2 -top-8 w-px h-8 bg-gradient-to-b from-gray-300 to-gray-200 -translate-x-1/2" />
      )}

      {/* Phase Card */}
      <Card 
        className={cn(
          "relative max-w-sm mx-auto transition-all duration-300 hover:shadow-lg cursor-pointer group",
          !isAccessible && "opacity-60 cursor-not-allowed",
          phase.status === "active" && "ring-2 ring-toeic-primary/20 bg-gradient-to-br from-orange-50 to-red-50",
          phase.status === "completed" && "bg-gradient-to-br from-green-50 to-emerald-50"
        )}
        onClick={() => isAccessible && onPhasePress(phase.phase_id)}
      >
        {/* Phase Number Circle */}
        <div 
          className={cn(
            "absolute -top-4 left-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10",
            statusConfig.color,
            isAccessible && "group-hover:scale-110 transition-transform duration-300"
          )}
        >
          <div className="text-center">
            <div className="text-xs font-bold leading-none">Phase</div>
            <div className="text-lg font-bold leading-none">{phase.order_no}</div>
          </div>
        </div>

        <CardContent className="pt-8 pb-6 px-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-2">
              <h3 className="font-bold text-base leading-tight mb-1">
                {phase.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {phase.lessons.length} bài học
              </p>
            </div>
            <Badge className={statusConfig.badgeClass} variant="outline">
              {statusConfig.badge}
            </Badge>
          </div>

          {/* Progress Bar */}
          {phase.status !== "locked" && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Tiến độ</span>
                <span className="font-medium">{completedLessons}/{phase.lessons.length}</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className={cn(
                  "h-2",
                  phase.status === "completed" && "[&>div]:bg-green-500",
                  phase.status === "active" && "[&>div]:bg-toeic-primary"
                )}
              />
            </div>
          )}

          {/* Lesson Pills */}
          <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-2">Bài học:</div>
            <div className="flex flex-wrap gap-1.5">
              {phase.lessons.slice(0, 4).map((lessonId, idx) => (
                <div
                  key={lessonId}
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    idx < completedLessons 
                      ? "bg-green-100 text-green-700 border border-green-200" 
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  )}
                >
                  Bài {lessonId}
                </div>
              ))}
              {phase.lessons.length > 4 && (
                <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  +{phase.lessons.length - 4}
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>~{phase.lessons.length * 15} phút</span>
            </div>
            
            {isAccessible && (
              <Button 
                size="sm" 
                className={cn(
                  "h-8 px-3 text-xs font-medium",
                  phase.status === "active" 
                    ? "bg-toeic-primary hover:bg-red-600 text-white" 
                    : "bg-green-600 hover:bg-green-700 text-white"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onPhaseStart(phase.phase_id);
                }}
              >
                {statusConfig.icon}
                <span className="ml-1">
                  {phase.status === "completed" ? "Ôn tập" : "Bắt đầu"}
                </span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
