"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phase } from "@/types/study-plan";
import {
  getPhaseStatusColor,
  isPhaseAccessible,
  getPhaseDescription,
} from "@/libs/study-plan-data";
import { Play, Lock, CheckCircle, ArrowRight } from "lucide-react";
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

  const getStatusIcon = () => {
    switch (phase.status) {
      case "completed":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "active":
        return <Play className="h-8 w-8 text-[#ff776f]" />;
      default:
        return <Lock className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (phase.status) {
      case "completed":
        return <Badge className="bg-green-500">Hoàn thành</Badge>;
      case "active":
        return <Badge className="bg-[#ff776f]">Khả dụng</Badge>;
      default:
        return <Badge variant="secondary">Đã khóa</Badge>;
    }
  };

  return (
    <div
      className={cn(
        "mb-8 flex items-center relative",
        isLeft ? "justify-start" : "justify-end"
      )}
    >
      {/* Connection Line */}
      {index > 0 && (
        <div
          className={cn(
            "absolute top-1/2 w-32 h-px bg-border",
            isLeft ? "-left-32" : "-right-32"
          )}
        />
      )}

      {/* Phase Number Badge */}
      <div
        className={cn(
          "absolute top-0 z-10 w-8 h-8 rounded-full bg-background border-2 flex items-center justify-center text-sm font-bold",
          isLeft ? "-left-4" : "-right-4"
        )}
        style={{ borderColor: getPhaseStatusColor(phase.status) }}
      >
        {phase.order_no}
      </div>

      <div
        className={cn(
          "flex items-center gap-4 max-w-md",
          isLeft ? "flex-row" : "flex-row-reverse"
        )}
      >
        {/* Node Circle */}
        <Button
          variant="ghost"
          size="lg"
          className={cn(
            "h-16 w-16 rounded-full p-0",
            isAccessible
              ? "hover:scale-110 transition-transform"
              : "opacity-60 cursor-not-allowed"
          )}
          style={{
            backgroundColor: getPhaseStatusColor(phase.status),
            color: "white",
          }}
          onClick={() => isAccessible && onPhaseStart(phase.phase_id)}
          disabled={!isAccessible}
        >
          {getStatusIcon()}
        </Button>

        {/* Phase Info Card */}
        <Card
          className={cn(
            "transition-shadow hover:shadow-md cursor-pointer",
            !isAccessible && "opacity-70"
          )}
          onClick={() => isAccessible && onPhasePress(phase.phase_id)}
        >
          <CardContent className="p-4 space-y-3">
            {/* Status Badge */}
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-sm leading-tight">
                {phase.title}
              </h3>
              {getStatusBadge()}
            </div>

            <p className="text-xs text-muted-foreground">{lessonDescription}</p>

            {/* Lesson Preview */}
            <div className="flex flex-wrap gap-1">
              {phase.lessons.slice(0, 3).map((lessonId, idx) => (
                <Badge key={lessonId} variant="outline" className="text-xs">
                  Bài {lessonId}
                </Badge>
              ))}
              {phase.lessons.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{phase.lessons.length - 3}
                </Badge>
              )}
            </div>

            {/* Action Button */}
            {isAccessible && (
              <div className="flex items-center text-xs text-[#ff776f] font-medium">
                <ArrowRight className="h-3 w-3 mr-1" />
                Bắt đầu học
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
