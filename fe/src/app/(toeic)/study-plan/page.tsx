"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PhaseNode } from "@/components/toeic/study-plan/phase-node";
import { mockPhases } from "@/lib/study-plan-data";
import { Target, Calendar, Clock, Award } from "lucide-react";

export default function StudyPlanPage() {
  const [phases] = useState(mockPhases);

  const handlePhasePress = (phaseId: string) => {
    console.log('Phase pressed:', phaseId);
    // TODO: Navigate to phase details
  };

  const handlePhaseStart = (phaseId: string) => {
    console.log('Phase started:', phaseId);
    // TODO: Start the phase
  };

  const completedPhases = phases.filter(p => p.status === 'completed').length;
  const totalPhases = phases.length;
  const progress = (completedPhases / totalPhases) * 100;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Kế hoạch học TOEIC</h1>
        <p className="text-muted-foreground">
          Tiến trình học tập có hệ thống từ cơ bản đến nâng cao
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2 text-[#ff776f]" />
              Tiến độ tổng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{completedPhases}/{totalPhases} giai đoạn</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-[#ff776f]" />
              Ngày học
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <div className="text-sm text-muted-foreground">ngày liên tiếp</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-[#ff776f]" />
              Thời gian học
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24h</div>
            <div className="text-sm text-muted-foreground">tổng cộng</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="h-4 w-4 mr-2 text-[#ff776f]" />
              Mục tiêu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">750+</div>
            <div className="text-sm text-muted-foreground">điểm TOEIC</div>
          </CardContent>
        </Card>
      </div>

      {/* Phase List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lộ trình học tập</span>
            <Badge variant="outline">
              {phases.length} giai đoạn
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-8 relative">
              {/* Center Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
              
              {phases.map((phase, index) => (
                <PhaseNode
                  key={phase.phase_id}
                  phase={phase}
                  index={index}
                  isLeft={index % 2 === 0}
                  onPhasePress={handlePhasePress}
                  onPhaseStart={handlePhaseStart}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* End Message */}
      <Card className="text-center">
        <CardContent className="p-6">
          <Award className="h-12 w-12 text-[#ff776f] mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Hoàn thành tất cả giai đoạn</h3>
          <p className="text-muted-foreground">
            Bạn sẽ đạt được mục tiêu 750+ điểm TOEIC với lộ trình học tập này!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
