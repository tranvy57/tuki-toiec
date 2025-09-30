"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PhaseNode } from "@/components/toeic/study-plan/phase-node";
import { mockPhases } from "@/libs/study-plan-data";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Target,
  Calendar,
  Award,
  BarChart3,
  Play,
  ChevronRight,
  Star
} from "lucide-react";

// Mock data cho daily study tasks
interface StudyTask {
  id: string;
  title: string;
  type: "vocabulary" | "grammar" | "listening" | "reading" | "practice";
  duration: number; // minutes
  progress: number; // 0-100
  isCompleted: boolean;
  isLocked: boolean;
  phaseId: string;
  lessonId: string;
  description: string;
}

const mockTodayTasks: StudyTask[] = [
  {
    id: "task1",
    title: "Từ vựng công việc - Bài 1",
    type: "vocabulary",
    duration: 15,
    progress: 0,
    isCompleted: false,
    isLocked: false,
    phaseId: "phase1",
    lessonId: "lesson1",
    description: "Học 20 từ vựng chủ đề công việc"
  },
  {
    id: "task2", 
    title: "Ngữ pháp cơ bản - Thì hiện tại",
    type: "grammar",
    duration: 20,
    progress: 60,
    isCompleted: false,
    isLocked: false,
    phaseId: "phase1",
    lessonId: "lesson2",
    description: "Ôn tập và luyện tập thì hiện tại đơn, tiếp diễn"
  },
  {
    id: "task3",
    title: "Luyện nghe Part 1 - Mô tả hình ảnh",
    type: "listening", 
    duration: 25,
    progress: 100,
    isCompleted: true,
    isLocked: false,
    phaseId: "phase1",
    lessonId: "lesson3",
    description: "Hoàn thành 10 câu hỏi mô tả hình ảnh"
  },
  {
    id: "task4",
    title: "Đọc hiểu email doanh nghiệp",
    type: "reading",
    duration: 30,
    progress: 0,
    isCompleted: false,
    isLocked: true,
    phaseId: "phase2",
    lessonId: "lesson4", 
    description: "Đọc và trả lời câu hỏi về email công việc"
  },
  {
    id: "task5",
    title: "Mini Test - Grammar & Vocabulary",
    type: "practice",
    duration: 45,
    progress: 0,
    isCompleted: false,
    isLocked: true,
    phaseId: "phase1",
    lessonId: "test1",
    description: "Kiểm tra 30 câu hỏi tổng hợp"
  }
];

export default function StudyPlanPage() {
  const [phases] = useState(mockPhases);
  const [todayTasks, setTodayTasks] = useState(mockTodayTasks);
  const [showRoadmap, setShowRoadmap] = useState(false);

  const handleTaskComplete = (taskId: string) => {
    setTodayTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, isCompleted: true, progress: 100 } : task
    ));
  };

  const handleTaskStart = (taskId: string) => {
    console.log("Starting task:", taskId);
    // TODO: Navigate to actual lesson/practice
  };

  const completedTasks = todayTasks.filter(task => task.isCompleted).length;
  const totalTasks = todayTasks.length;
  const todayProgress = (completedTasks / totalTasks) * 100;

  const completedPhases = phases.filter((p) => p.status === "completed").length;
  const totalPhases = phases.length;
  const overallProgress = (completedPhases / totalPhases) * 100;

  const getTaskIcon = (type: StudyTask["type"]) => {
    switch (type) {
      case "vocabulary": return BookOpen;
      case "grammar": return PenTool;
      case "listening": return Headphones;
      case "reading": return BookOpen;
      case "practice": return Target;
      default: return Circle;
    }
  };

  const getTaskColor = (type: StudyTask["type"]) => {
    switch (type) {
      case "vocabulary": return "text-blue-600 bg-blue-50";
      case "grammar": return "text-green-600 bg-green-50";
      case "listening": return "text-purple-600 bg-purple-50";
      case "reading": return "text-orange-600 bg-orange-50";
      case "practice": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Nhiệm vụ hôm nay</h1>
          <p className="text-muted-foreground">
            Hoàn thành các bài học để tiến bộ trong lộ trình TOEIC của bạn
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Tiến độ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tổng quan tiến độ học tập</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tiến độ hôm nay</span>
                    <span>{completedTasks}/{totalTasks} nhiệm vụ</span>
                  </div>
                  <Progress value={todayProgress} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tiến độ tổng thể</span>
                    <span>{completedPhases}/{totalPhases} giai đoạn</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-toeic-primary">15</div>
                    <div className="text-sm text-muted-foreground">ngày học liên tiếp</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-toeic-primary">24h</div>
                    <div className="text-sm text-muted-foreground">tổng thời gian</div>
                  </div>
                </div>

                <div className="text-center pt-2 border-t">
                  <div className="text-lg font-semibold">Mục tiêu: 750+ điểm TOEIC</div>
                  <div className="text-sm text-muted-foreground">Dự kiến hoàn thành trong 3 tháng</div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm" onClick={() => setShowRoadmap(true)}>
            <Target className="h-4 w-4 mr-2" />
            Lộ trình
          </Button>
        </div>
      </div>

      {/* Today's Progress */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Tiến độ hôm nay</CardTitle>
            <Badge variant="secondary">{completedTasks}/{totalTasks} hoàn thành</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={todayProgress} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Tiến độ: {Math.round(todayProgress)}%</span>
              <span>Còn lại: {totalTasks - completedTasks} nhiệm vụ</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Tasks List */}
      <div className="space-y-4">
        {todayTasks.map((task, index) => {
          const IconComponent = getTaskIcon(task.type);
          const colorClass = getTaskColor(task.type);
          
          return (
            <Card key={task.id} className={`transition-all hover:shadow-md ${task.isLocked ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Status & Icon */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => !task.isLocked && !task.isCompleted && handleTaskComplete(task.id)}
                      disabled={task.isLocked}
                      className="flex-shrink-0"
                    >
                      {task.isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className={`h-6 w-6 ${task.isLocked ? 'text-gray-400' : 'text-gray-500 hover:text-toeic-primary'}`} />
                      )}
                    </button>
                    
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium ${task.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {task.duration} phút
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    
                    {/* Progress Bar */}
                    {task.progress > 0 && !task.isCompleted && (
                      <div className="mt-2 space-y-1">
                        <Progress value={task.progress} className="h-1.5" />
                        <div className="text-xs text-muted-foreground">Tiến độ: {task.progress}%</div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {task.isCompleted ? (
                      <Button variant="ghost" size="sm" disabled>
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        Hoàn thành
                      </Button>
                    ) : task.isLocked ? (
                      <Button variant="ghost" size="sm" disabled>
                        🔒 Chưa mở khóa
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleTaskStart(task.id)}
                        className="bg-toeic-primary hover:bg-red-600"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {task.progress > 0 ? 'Tiếp tục' : 'Bắt đầu'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Roadmap Modal */}
      <Dialog open={showRoadmap} onOpenChange={setShowRoadmap}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Lộ trình học TOEIC</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[600px] pr-4">
            <div className="py-4">
              {phases.map((phase, index) => (
                <PhaseNode
                  key={phase.phase_id}
                  phase={phase}
                  index={index}
                  isLeft={true} // Not used anymore
                  onPhasePress={(phaseId) => {
                    console.log("Navigate to phase tasks:", phaseId);
                    setShowRoadmap(false);
                  }}
                  onPhaseStart={(phaseId) => {
                    console.log("Start phase:", phaseId);
                    setShowRoadmap(false);
                  }}
                />
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Motivational Footer */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-toeic-primary/20">
        <CardContent className="p-6 text-center">
          <Star className="h-8 w-8 text-toeic-primary mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Tiếp tục phát huy!</h3>
          <p className="text-muted-foreground">
            Mỗi nhiệm vụ hoàn thành đều đưa bạn gần hơn đến mục tiêu 750+ điểm TOEIC
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
