"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Save,
  RotateCcw,
  Clock,
  FileText,
  Zap,
  Target,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// Mock data cho từng loại bài tập
const mockExerciseData = {
  "describe-picture": {
    id: "1",
    name: "Mô tả hình ảnh",
    title: "Mô tả hình ảnh dưới đây",
    prompt:
      "Nhìn vào hình ảnh của một người đàn ông đang làm việc trên laptop trong quán cà phê. Viết năm câu mô tả những gì bạn nhìn thấy.",
    attachmentUrl: "/images/writing_picture_1.jpg",
    difficulty: "Easy",
    difficultyColor: "bg-green-100 text-green-800",
    wordLimit: { min: 50, max: 80 },
    timeLimit: "10 phút",
    instructions: [
      "Viết 5 câu hoàn chỉnh mô tả hình ảnh",
      "Sử dụng thì hiện tại tiếp diễn (Present Continuous)",
      "Mô tả vị trí, hành động và đồ vật trong hình",
    ],
    sampleAnswer:
      "A man is sitting at a wooden table using his laptop. He is wearing glasses and drinking coffee. The cafe has a cozy atmosphere with warm lighting. There are other customers in the background. He appears to be concentrated on his work.",
  },
  "email-response": {
    id: "2",
    name: "Trả lời email",
    title: "Trả lời email yêu cầu này",
    prompt:
      "Bạn nhận được email này: 'Could you confirm your availability for the meeting tomorrow morning at 10 AM? Please let me know if you need to reschedule.' Viết một câu trả lời lịch sự (50-80 từ).",
    difficulty: "Medium",
    difficultyColor: "bg-yellow-100 text-yellow-800",
    wordLimit: { min: 50, max: 80 },
    timeLimit: "15 phút",
    instructions: [
      "Bắt đầu với lời chào phù hợp",
      "Xác nhận hoặc đề xuất thời gian khác",
      "Kết thúc một cách lịch sự và chuyên nghiệp",
    ],
    sampleAnswer:
      "Thank you for your message. I confirm my availability for tomorrow's meeting at 10 AM. I look forward to our discussion. Please let me know if there are any materials I should prepare in advance. Best regards.",
  },
  "opinion-essay": {
    id: "3",
    name: "Viết đoạn nêu quan điểm",
    title: "Viết đoạn văn nêu quan điểm",
    prompt:
      "Bạn có nghĩ rằng làm việc tại nhà tốt hơn làm việc tại văn phòng không? Viết một đoạn văn ngắn (150-200 từ) đưa ra quan điểm và lý do của bạn.",
    difficulty: "Hard",
    difficultyColor: "bg-red-100 text-red-800",
    wordLimit: { min: 150, max: 200 },
    timeLimit: "25 phút",
    instructions: [
      "Đưa ra quan điểm rõ ràng trong câu chủ đề",
      "Cung cấp 2-3 lý do cụ thể",
      "Sử dụng các từ nối để liên kết ý tưởng",
      "Kết luận khẳng định lại quan điểm",
    ],
    sampleAnswer:
      "I believe working from home offers significant advantages over traditional office work. Firstly, remote work eliminates commuting time, allowing employees to have better work-life balance and reduced stress. Moreover, the home environment often provides fewer distractions than busy offices, leading to increased productivity. However, I acknowledge that office work facilitates face-to-face collaboration and team building. Nevertheless, with modern communication tools, remote workers can maintain effective collaboration while enjoying the flexibility and comfort of their home workspace. Overall, the benefits of working from home outweigh the drawbacks in today's digital age.",
  },
  "grammar-fix": {
    id: "4",
    name: "Sửa câu sai",
    title: "Sửa câu sau đây",
    prompt: "He don't has any time for do his homework yesterday night.",
    difficulty: "Easy",
    difficultyColor: "bg-green-100 text-green-800",
    wordLimit: { min: 10, max: 20 },
    timeLimit: "5 phút",
    instructions: [
      "Xác định lỗi ngữ pháp trong câu",
      "Sửa các lỗi về thì, động từ, giới từ",
      "Đảm bảo câu có ý nghĩa rõ ràng",
    ],
    correctAnswer: "He didn't have any time to do his homework last night.",
    commonErrors: [
      {
        error: "don't has",
        correction: "doesn't have / didn't have",
        explanation: "Lỗi chia động từ",
      },
      {
        error: "for do",
        correction: "to do",
        explanation: "Sử dụng sai giới từ",
      },
      {
        error: "yesterday night",
        correction: "last night",
        explanation: "Cách diễn đạt thời gian",
      },
    ],
  },
};

// Mock feedback AI
const mockAIFeedback = {
  grammar_score: 85,
  coherence_score: 78,
  vocabulary_score: 82,
  overall_score: 82,
  feedback:
    "Bài viết của bạn có cấu trúc tốt và sử dụng ngữ pháp chính xác. Tuy nhiên, hãy thử sử dụng thêm các từ nối như 'Moreover', 'However', 'In addition' để làm cho bài viết mạch lạc hơn. Từ vựng phong phú, nhưng có thể thêm một số từ miêu tả chi tiết hơn.",
  suggestions: [
    "Sử dụng thêm từ nối để liên kết các ý tưởng",
    "Thêm tính từ miêu tả để làm phong phú bài viết",
    "Kiểm tra lại thì của động từ trong một số câu",
  ],
};

export default function WritingExercisePage() {
  const params = useParams();
  const router = useRouter();
  const [userInput, setUserInput] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGrammarChecked, setIsGrammarChecked] = useState(false);
  const [showAIFeedback, setShowAIFeedback] = useState(false);
  const [grammarErrors, setGrammarErrors] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const slug = params.slug as string;
  const exerciseData = mockExerciseData[slug as keyof typeof mockExerciseData];

  useEffect(() => {
    // Timer
    intervalRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    // Count words
    const words = userInput
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);

    // Calculate progress based on word count
    if (exerciseData?.wordLimit) {
      const progressPercent = Math.min(
        (words.length / exerciseData.wordLimit.min) * 100,
        100
      );
      setProgress(progressPercent);
    }
  }, [userInput, exerciseData?.wordLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleGrammarCheck = () => {
    // Mock LanguageTool output
    const mockErrors = [
      {
        offset: 0,
        length: 5,
        message: "Lỗi ngữ pháp: Sử dụng sai thì động từ",
        replacements: ["is working", "works"],
      },
      {
        offset: 15,
        length: 3,
        message: "Lỗi chính tả",
        replacements: ["the", "this"],
      },
    ];

    setGrammarErrors(mockErrors);
    setIsGrammarChecked(true);
  };

  const handleAIFeedback = () => {
    setShowAIFeedback(true);
  };

  const handleSave = () => {
    // Mock save functionality
    alert("Bài viết đã được lưu!");
  };

  const handleReset = () => {
    setUserInput("");
    setWordCount(0);
    setIsGrammarChecked(false);
    setGrammarErrors([]);
    setProgress(0);
  };

  if (!exerciseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <Card className="p-6 text-center">
          <p className="text-gray-600">Không tìm thấy bài tập này.</p>
          <Button onClick={() => router.back()} className="mt-4">
            Quay lại
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {exerciseData.name}
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <Badge className={exerciseData.difficultyColor}>
                  {exerciseData.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeElapsed)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">
              Tiến độ: {Math.round(progress)}%
            </div>
            <Progress value={progress} className="w-32" />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Prompt */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-fit sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {exerciseData.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image for picture description */}
                {slug === "describe-picture" && (
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <FileText className="w-12 h-12" />
                      <span className="ml-2">Hình ảnh mẫu</span>
                    </div>
                  </div>
                )}

                {/* Prompt */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {exerciseData.prompt}
                  </p>
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Hướng dẫn:
                  </h4>
                  <ul className="space-y-1">
                    {exerciseData.instructions.map((instruction, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-start gap-2"
                      >
                        <span className="text-pink-500 mt-1">•</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>
                      {exerciseData.wordLimit.min}-{exerciseData.wordLimit.max}{" "}
                      từ
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{exerciseData.timeLimit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Side - Writing Editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Viết câu trả lời
                  </CardTitle>
                  <div className="text-sm text-gray-600">
                    {wordCount}/{exerciseData.wordLimit.max} từ
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Writing Area */}
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Bắt đầu viết câu trả lời của bạn..."
                    className="min-h-[300px] resize-none text-base leading-relaxed"
                  />

                  {/* Grammar Error Highlights */}
                  {isGrammarChecked && grammarErrors.length > 0 && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* This would contain highlighted text overlays */}
                    </div>
                  )}
                </div>

                {/* Grammar Errors Display */}
                <AnimatePresence>
                  {isGrammarChecked && grammarErrors.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <h5 className="text-sm font-medium text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Lỗi ngữ pháp được phát hiện:
                      </h5>
                      {grammarErrors.map((error, index) => (
                        <div
                          key={index}
                          className="bg-red-50 border border-red-200 rounded-lg p-3"
                        >
                          <p className="text-sm text-red-700">
                            {error.message}
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            Gợi ý: {error.replacements.join(", ")}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleGrammarCheck}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Kiểm tra ngữ pháp
                  </Button>

                  <Button
                    onClick={handleAIFeedback}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Nhận phản hồi AI
                  </Button>

                  <Button
                    onClick={handleSave}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Lưu bài
                  </Button>

                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Làm lại
                  </Button>
                </div>

                {/* Word Count Progress */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Số từ</span>
                    <span
                      className={`text-sm font-medium ${
                        wordCount >= exerciseData.wordLimit.min &&
                        wordCount <= exerciseData.wordLimit.max
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {wordCount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        wordCount >= exerciseData.wordLimit.min &&
                        wordCount <= exerciseData.wordLimit.max
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (wordCount / exerciseData.wordLimit.max) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI Feedback Modal */}
        <Dialog open={showAIFeedback} onOpenChange={setShowAIFeedback}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                Phản hồi AI
              </DialogTitle>
              <DialogDescription>
                Đánh giá và gợi ý cải thiện bài viết của bạn
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Scores */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {mockAIFeedback.grammar_score}
                  </div>
                  <div className="text-xs text-gray-600">Ngữ pháp</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {mockAIFeedback.coherence_score}
                  </div>
                  <div className="text-xs text-gray-600">Mạch lạc</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {mockAIFeedback.vocabulary_score}
                  </div>
                  <div className="text-xs text-gray-600">Từ vựng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {mockAIFeedback.overall_score}
                  </div>
                  <div className="text-xs text-gray-600">Tổng điểm</div>
                </div>
              </div>

              {/* Feedback */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">Nhận xét:</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {mockAIFeedback.feedback}
                </p>
              </div>

              {/* Suggestions */}
              <div>
                <h4 className="font-medium mb-2">Gợi ý cải thiện:</h4>
                <ul className="space-y-2">
                  {mockAIFeedback.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Zap className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAIFeedback(false)}
                >
                  Đóng
                </Button>
                <Button onClick={() => setShowAIFeedback(false)}>Cảm ơn</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
