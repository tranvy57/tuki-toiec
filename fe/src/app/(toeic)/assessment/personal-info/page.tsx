"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  User, 
  Target, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface PersonalInfo {
  currentLevel: string;
  targetScore: string;
  deadline: string;
  experience: string;
  motivation: string;
}

const levelOptions = [
  { value: "beginner", label: "Mới bắt đầu", description: "Chưa từng học TOEIC hoặc điểm dưới 300" },
  { value: "elementary", label: "Cơ bản", description: "Đã học một ít, điểm khoảng 300-450" },
  { value: "intermediate", label: "Trung bình", description: "Có kiến thức nền tảng, điểm khoảng 450-600" },
  { value: "upper-intermediate", label: "Khá", description: "Khá tốt, điểm khoảng 600-750" },
  { value: "advanced", label: "Nâng cao", description: "Rất tốt, điểm trên 750" }
];

const targetScoreOptions = [
  { value: "450", label: "450 điểm", description: "Mục tiêu cơ bản cho công việc" },
  { value: "600", label: "600 điểm", description: "Yêu cầu của nhiều công ty" },
  { value: "750", label: "750 điểm", description: "Mức điểm tốt cho hầu hết vị trí" },
  { value: "850", label: "850 điểm", description: "Mức điểm cao cho vị trí quản lý" },
  { value: "900+", label: "900+ điểm", description: "Mức điểm xuất sắc" }
];

const deadlineOptions = [
  { value: "1month", label: "1 tháng", description: "Mục tiêu cấp bách" },
  { value: "3months", label: "3 tháng", description: "Kế hoạch ngắn hạn" },
  { value: "6months", label: "6 tháng", description: "Kế hoạch trung hạn" },
  { value: "1year", label: "1 năm", description: "Kế hoạch dài hạn" },
  { value: "flexible", label: "Linh hoạt", description: "Không có deadline cụ thể" }
];

export default function PersonalInfoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<PersonalInfo>({
    currentLevel: "",
    targetScore: "",
    deadline: "",
    experience: "",
    motivation: ""
  });

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 3;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return formData.currentLevel !== "";
      case 1: return formData.targetScore !== "";
      case 2: return formData.deadline !== "";
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Save personal info and proceed to listening test
    console.log("Personal Info:", formData);
    toast.success("Đã lưu thông tin cá nhân!");
    router.push("/assessment/review-test");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <User className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-xl font-semibold">Trình độ hiện tại của bạn</h2>
              <p className="text-muted-foreground">Hãy chọn mức độ mô tả chính xác nhất về khả năng TOEIC của bạn</p>
            </div>
            
            <RadioGroup 
              value={formData.currentLevel} 
              onValueChange={(value) => setFormData({...formData, currentLevel: value})}
            >
              {levelOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex-1">
                    <Label htmlFor={option.value} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h2 className="text-xl font-semibold">Mục tiêu điểm số</h2>
              <p className="text-muted-foreground">Bạn muốn đạt được bao nhiêu điểm TOEIC?</p>
            </div>
            
            <RadioGroup 
              value={formData.targetScore} 
              onValueChange={(value) => setFormData({...formData, targetScore: value})}
            >
              {targetScoreOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex-1">
                    <Label htmlFor={option.value} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Calendar className="h-12 w-12 text-orange-600 mx-auto mb-3" />
              <h2 className="text-xl font-semibold">Thời hạn mục tiêu</h2>
              <p className="text-muted-foreground">Bạn muốn đạt mục tiêu trong thời gian bao lâu?</p>
            </div>
            
            <RadioGroup 
              value={formData.deadline} 
              onValueChange={(value) => setFormData({...formData, deadline: value})}
            >
              {deadlineOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex-1">
                    <Label htmlFor={option.value} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0: return "Trình độ hiện tại";
      case 1: return "Mục tiêu điểm số";
      case 2: return "Thời hạn mục tiêu";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Thông tin cá nhân</h1>
            <p className="text-muted-foreground">
              Bước 1/4: Để tạo lộ trình phù hợp, hãy cho chúng tôi biết về bạn
            </p>
          </div>

          {/* Progress */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Bước {currentStep + 1}/{totalSteps}</span>
                  <Badge variant="outline">{getStepTitle()}</Badge>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {Math.round(progressPercentage)}% hoàn thành
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card>
            <CardContent className="p-6">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i <= currentStep ? 'bg-toeic-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button 
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-toeic-primary hover:bg-red-600"
            >
              {currentStep === totalSteps - 1 ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Hoàn thành
                </>
              ) : (
                <>
                  Tiếp theo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Help Note */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 mb-1">Lưu ý:</p>
                  <p className="text-blue-700">
                    Thông tin này sẽ giúp chúng tôi tạo lộ trình học phù hợp nhất với bạn. 
                    Bạn có thể thay đổi mục tiêu sau này trong quá trình học.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
