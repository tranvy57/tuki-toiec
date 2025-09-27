"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  Target,
  BookOpen,
  ArrowRight,
  Loader2,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Award,
  Play,
  Users,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

// Mock data - trong thực tế sẽ fetch từ API
interface UserPlan {
  id: string;
  targetScore: number;
  currentLevel: "beginner" | "intermediate" | "advanced";
  estimatedDuration: number; // weeks
  createdAt: Date;
  phases: number;
  completedAssessment: boolean;
}

interface AssessmentStep {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  isCompleted: boolean;
  score?: number;
}

const mockAssessmentSteps: AssessmentStep[] = [
  {
    id: "personal-info",
    title: "Thông tin cá nhân",
    description: "Cho chúng tôi biết về mục tiêu và thời gian học của bạn",
    duration: 2,
    isCompleted: false,
  },
  {
    id: "review test",
    title: "Đánh giá ",
    description: "Bài đánh giá trình độ TOEIC",
    duration: 15,
    isCompleted: false,
  },
];

export default function PlanCheckPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [assessmentSteps, setAssessmentSteps] = useState(mockAssessmentSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [isStartingAssessment, setIsStartingAssessment] = useState(false);

  // Simulate API call to check user plan
  useEffect(() => {
    const checkUserPlan = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock: 70% chance user doesn't have plan
      const hasPlan = Math.random() > 0.7;

      if (hasPlan) {
        setUserPlan({
          id: "plan-1",
          targetScore: 750,
          currentLevel: "intermediate",
          estimatedDuration: 12,
          createdAt: new Date(),
          phases: 4,
          completedAssessment: true,
        });
      }

      setIsLoading(false);
    };

    checkUserPlan();
  }, []);

  const handleStartAssessment = () => {
    setIsStartingAssessment(true);
    // Simulate starting assessment
    setTimeout(() => {
      toast.success("Bắt đầu bài đánh giá trình độ!");
      // Navigate to first assessment step
      router.push("/assessment/personal-info");
    }, 1000);
  };

  const handleContinueToStudyPlan = () => {
    router.push("/study-plan");
  };

  const handleRetakeAssessment = () => {
    setUserPlan(null);
    setAssessmentSteps(
      mockAssessmentSteps.map((step) => ({ ...step, isCompleted: false }))
    );
    toast.info("Sẵn sàng làm lại bài đánh giá!");
  };

  const completedSteps = assessmentSteps.filter(
    (step) => step.isCompleted
  ).length;
  const totalSteps = assessmentSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;
  const totalDuration = assessmentSteps.reduce(
    (sum, step) => sum + step.duration,
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-red-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 text-toeic-primary mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">
              Đang kiểm tra lộ trình học...
            </h3>
            <p className="text-muted-foreground text-sm">
              Vui lòng chờ trong giây lát
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="bg-gradient-to-br from-orange-50 via-pink-50 to-red-50"
      style={{
        height: "calc(100vh - 64px)",
      }}
    >
      <div className="container mx-auto px-4 pt-4">
        {userPlan ? (
          // User has existing plan
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Welcome Back Header */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Chào mừng bạn trở lại!
                </h1>
                <p className="text-gray-600">
                  Bạn đã có lộ trình học TOEIC cá nhân hóa. Tiếp tục hành trình
                  của bạn ngay thôi!
                </p>
              </div>
            </div>

            {/* Plan Overview */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-toeic-primary" />
                    Lộ trình hiện tại
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {userPlan.targetScore}
                      </div>
                      <div className="text-sm text-blue-600">Mục tiêu</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {userPlan.phases}
                      </div>
                      <div className="text-sm text-green-600">Giai đoạn</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Trình độ hiện tại:</span>
                      <Badge className="bg-orange-100 text-orange-700">
                        {userPlan.currentLevel === "beginner"
                          ? "Cơ bản"
                          : userPlan.currentLevel === "intermediate"
                          ? "Trung bình"
                          : "Nâng cao"}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Thời gian dự kiến:</span>
                      <span className="font-medium">
                        {userPlan.estimatedDuration} tuần
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tạo ngày:</span>
                      <span className="font-medium">
                        {userPlan.createdAt.toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-toeic-primary" />
                    Thống kê học tập
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        15
                      </div>
                      <div className="text-sm text-purple-600">Ngày streak</div>
                    </div>
                    <div className="text-center p-3 bg-indigo-50 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">
                        24h
                      </div>
                      <div className="text-sm text-indigo-600">
                        Tổng thời gian
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tiến độ tổng thể</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Hoàn thành 1/4 giai đoạn
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-toeic-primary hover:bg-red-600 text-white"
                onClick={handleContinueToStudyPlan}
              >
                <Play className="h-5 w-5 mr-2" />
                Tiếp tục học tập
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleRetakeAssessment}
              >
                <FileText className="h-5 w-5 mr-2" />
                Làm lại đánh giá
              </Button>
            </div>
          </div>
        ) : (
          // User needs to take assessment
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Tạo lộ trình học cá nhân
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Để tạo lộ trình học TOEIC phù hợp nhất, chúng tôi cần đánh giá
                  trình độ hiện tại của bạn. Quá trình này chỉ mất khoảng{" "}
                  {totalDuration} phút.
                </p>
              </div>
            </div>

            {/* Assessment Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    Quy trình đánh giá trình độ
                  </span>
                  <Badge variant="outline">{totalSteps} bước</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                      Bạn sẽ được đánh giá:
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm">
                          Khả năng nghe hiểu (Listening)
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm">
                          Khả năng đọc hiểu (Reading)
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm">
                          Kiến thức ngữ pháp (Grammar)
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Mục tiêu cá nhân</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                      Kết quả bạn nhận được:
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">
                          Lộ trình học cá nhân hóa
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">
                          Kế hoạch học theo thời gian
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">
                          Bài tập phù hợp trình độ
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Dự đoán điểm số TOEIC</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Các bước đánh giá</CardTitle>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      Tiến độ: {completedSteps}/{totalSteps} bước
                    </span>
                    <span>Thời gian: ~{totalDuration} phút</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {assessmentSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        step.isCompleted
                          ? "bg-green-50 border-green-200"
                          : index === currentStep
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              step.isCompleted
                                ? "bg-green-600 text-white"
                                : index === currentStep
                                ? "bg-blue-600 text-white"
                                : "bg-gray-400 text-white"
                            }`}
                          >
                            {step.isCompleted ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <span className="text-sm font-bold">
                                {index + 1}
                              </span>
                            )}
                          </div>

                          <div>
                            <h4 className="font-medium">{step.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Clock className="h-3 w-3" />
                            {step.duration} phút
                          </Badge>
                          {step.score && (
                            <Badge className="bg-green-100 text-green-700">
                              {step.score}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Start Assessment Button */}
            <div className="text-center">
              <Button
                size="lg"
                className="bg-toeic-primary hover:bg-red-600 text-white px-8"
                onClick={handleStartAssessment}
                disabled={isStartingAssessment}
              >
                {isStartingAssessment ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Đang chuẩn bị...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Bắt đầu đánh giá
                  </>
                )}
              </Button>

              <p className="text-sm text-muted-foreground mt-3">
                Bạn có thể tạm dừng và tiếp tục sau bất cứ lúc nào
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
