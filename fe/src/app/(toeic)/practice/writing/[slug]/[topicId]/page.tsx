"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import GrammarHighlightTextarea from "@/components/GrammarHighlightTextarea";
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
  Bot,
  Star,
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAIFeatures } from "@/hooks/use-ai-features";
import type {
  EvaluateEmailRequest,
  EvaluateImageDescriptionRequest,
  EvaluateOpinionEssayRequest,
  GenerateEmailRequest,
} from "@/types/ai-features";
import { writingExerciseTypes } from "../page";

// Mock data cho từng loại bài tập
// const mockExerciseData = {
//   // "describe-picture": {
//   //   id: "1",
//   //   name: "Mô tả hình ảnh",
//   //   title: "Mô tả hình ảnh dưới đây",
//   //   prompt:
//   //     "Nhìn vào hình ảnh của một người đàn ông đang làm việc trên laptop trong quán cà phê. Viết năm câu mô tả những gì bạn nhìn thấy.",
//   //   attachmentUrl: "/images/writing_picture_1.jpg",
//   //   difficulty: "Easy",
//   //   difficultyColor: "bg-green-100 text-green-800",
//   //   wordLimit: { min: 50, max: 80 },
//   //   timeLimit: "10 phút",
//   //   instructions: [
//   //     "Viết 5 câu hoàn chỉnh mô tả hình ảnh",
//   //     "Sử dụng thì hiện tại tiếp diễn (Present Continuous)",
//   //     "Mô tả vị trí, hành động và đồ vật trong hình",
//   //   ],
//   //   sampleAnswer:
//   //     "A man is sitting at a wooden table using his laptop. He is wearing glasses and drinking coffee. The cafe has a cozy atmosphere with warm lighting. There are other customers in the background. He appears to be concentrated on his work.",
//   // },
//   "email-response": {
//     id: "2",
//     name: "Trả lời email",
//     title: "Trả lời email yêu cầu này",
//     context: "reply email",
//     prompt:
//       "Bạn nhận được email này: 'Could you confirm your availability for the meeting tomorrow morning at 10 AM? Please let me know if you need to reschedule.' Viết một câu trả lời lịch sự (50-80 từ).",
//     difficulty: "Medium",
//     difficultyColor: "bg-yellow-100 text-yellow-800",
//     wordLimit: { min: 50, max: 80 },
//     timeLimit: "15 phút",
//     instructions: [
//       "Bắt đầu với lời chào phù hợp",
//       "Xác nhận hoặc đề xuất thời gian khác",
//       "Kết thúc một cách lịch sự và chuyên nghiệp",
//     ],
//   },
//   "opinion-essay": {
//     id: "3",
//     name: "Viết đoạn nêu quan điểm",
//     title: "Viết đoạn văn nêu quan điểm",
//     prompt:
//       "Bạn có nghĩ rằng làm việc tại nhà tốt hơn làm việc tại văn phòng không? Viết một đoạn văn ngắn (150-200 từ) đưa ra quan điểm và lý do của bạn.",
//     difficulty: "Hard",
//     difficultyColor: "bg-red-100 text-red-800",
//     wordLimit: { min: 150, max: 200 },
//     timeLimit: "25 phút",
//     context: "opinion",
//     instructions: [
//       "Đưa ra quan điểm rõ ràng trong câu chủ đề",
//       "Cung cấp 2-3 lý do cụ thể",
//       "Sử dụng các từ nối để liên kết ý tưởng",
//       "Kết luận khẳng định lại quan điểm",
//     ],
//   },
//   "grammar-fix": {
//     id: "4",
//     name: "Sửa câu sai",
//     title: "Sửa câu sau đây",
//     prompt: "He don't has any time for do his homework yesterday night.",
//     difficulty: "Easy",
//     difficultyColor: "bg-green-100 text-green-800",
//     wordLimit: { min: 10, max: 20 },
//     context: "grammar correction",
//     timeLimit: "5 phút",
//     instructions: [
//       "Xác định lỗi ngữ pháp trong câu",
//       "Sửa các lỗi về thì, động từ, giới từ",
//       "Đảm bảo câu có ý nghĩa rõ ràng",
//     ],
//     correctAnswer: "He didn't have any time to do his homework last night.",
//   },
// };

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
  const [aiEvaluation, setAiEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [generatedSample, setGeneratedSample] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize AI features
  const { evaluateWriting, evaluateImageDescription, generateEmail } =
    useAIFeatures();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const topicId = params.topicId as string;
  const slug = params.slug as string;
  const exerciseData = writingExerciseTypes.find(
    (exercise) => exercise.slug === slug
  );

  const subTopic = exerciseData?.subTopics.find((sub) => sub.id === topicId);

  // Nếu cần fallback an toàn
  if (!subTopic) {
    console.warn("Subtopic not found:", topicId);
  }
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
    if (subTopic?.wordLimit) {
      const progressPercent = Math.min(
        (words.length / subTopic.wordLimit) * 100,
        100
      );
      setProgress(progressPercent);
    }
  }, [userInput, subTopic?.wordLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // AI Evaluation Functions
  const handleAIEvaluation = async () => {
    if (!userInput.trim()) return;

    setIsEvaluating(true);
    setAiEvaluation(null);

    try {
      let result;

      switch (slug) {
        // case "describe-picture":
        //   result = await evaluateImageDescription.evaluateImageDescription({
        //     description: userInput,
        //     expectedElements: ["person", "laptop", "cafe", "table", "work"],
        //     descriptionType: "basic",
        //   });
        //   break;

        case "email-response":
          result = await evaluateWriting.evaluateWriting({
            type: "email",
            title: subTopic?.title,
            content: userInput,
            topic: subTopic?.topic,
            context: subTopic?.context || "Colleague/Manager",
          });
          break;

        case "opinion-essay":
          result = await evaluateWriting.evaluateWriting({
            type: "opinion-essay",
            content: userInput,
            topic: subTopic?.topic,
            requiredLength: subTopic?.wordLimit || 200,
            context: subTopic?.context || "opinion",
          });
          break;

        case "grammar-fix":
          // For grammar fix, we can use the writing evaluation as a general text evaluator
          result = await evaluateWriting.evaluateWriting({
            type: "email",
            content: userInput,
            title: "Grammar Check",
            topic: subTopic?.topic,
            context: "Grammar practice",
          });
          break;

        default:
          throw new Error("Unknown exercise type");
      }

      if (result) {
        setAiEvaluation(result);
        setShowAIFeedback(true);
      }
    } catch (error) {
      console.error("AI evaluation failed:", error);
      // alert("Đánh giá AI thất bại. Vui lòng thử lại.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleGenerateExample = async () => {
    if (topicId !== "email-response") return;

    setIsGenerating(true);
    setGeneratedSample(null);

    try {
      const result = await generateEmail.generateEmail({
        purpose: "Confirm meeting availability",
        tone: "formal",
        recipient: "Manager",
        mainPoints: [
          "Confirm availability",
          "Request agenda",
          "Professional closing",
        ],
        context: "Responding to meeting invitation",
        length: "short",
      });

      if (result) {
        setGeneratedSample(result);
      }
    } catch (error) {
      console.error("Email generation failed:", error);
      alert("Tạo mẫu email thất bại. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
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
                <Badge
                  className={
                    subTopic?.level === "Easy"
                      ? "bg-green-100 text-green-800"
                      : subTopic?.level === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {subTopic?.level}
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
                  {subTopic?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image for picture description */}
                {topicId === "describe-picture" && (
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
                    {subTopic?.topic}
                  </p>
                </div>

                {/* Instructions */}
                {/* <div className="space-y-2">
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
                </div> */}

                {/* Requirements */}
                {subTopic?.wordLimit && (
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>
                        {subTopic?.wordLimit - 20}-{subTopic?.wordLimit + 20} từ
                      </span>
                    </div>
                  </div>
                )}
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
                    {wordCount}/{subTopic?.wordLimit} từ
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Smart Writing Area with Grammar Check */}
                <GrammarHighlightTextarea
                  value={userInput}
                  onChange={setUserInput}
                  placeholder="Bắt đầu viết câu trả lời của bạn... (Kiểm tra ngữ pháp tự động sẽ hoạt động khi bạn gõ)"
                  maxLength={(subTopic?.wordLimit ?? 200) * 8} // Rough character estimate
                  className="min-h-[300px]"
                />

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
                    onClick={handleAIEvaluation}
                    disabled={isEvaluating || !userInput.trim()}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100"
                  >
                    {isEvaluating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                    {isEvaluating ? "Đang đánh giá..." : "Đánh giá AI"}
                  </Button>

                  {topicId === "email-response" && (
                    <Button
                      onClick={handleGenerateExample}
                      disabled={isGenerating}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:from-blue-100 hover:to-cyan-100"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      {isGenerating ? "Đang tạo..." : "Tạo mẫu email"}
                    </Button>
                  )}

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
                        wordCount >= (subTopic?.wordLimit ?? 200) - 20 &&
                        wordCount <= (subTopic?.wordLimit ?? 200) + 20
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
                        wordCount >= (subTopic?.wordLimit ?? 200) - 20 &&
                        wordCount <= (subTopic?.wordLimit ?? 200) + 20
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (wordCount / (subTopic?.wordLimit ?? 200)) * 100,
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
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-500" />
                Đánh giá AI - {exerciseData.name}
              </DialogTitle>
              <DialogDescription>
                Đánh giá chi tiết và gợi ý cải thiện bài viết của bạn
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {aiEvaluation ? (
                <>
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-2xl font-bold text-purple-700">
                        {aiEvaluation.overallScore}/100
                      </span>
                      <span className="text-purple-600">Điểm tổng</span>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(aiEvaluation.breakdown || {}).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="text-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="text-xl font-bold text-blue-600">
                            {Number(value)}
                          </div>
                          <div className="text-xs text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </div>
                          <Progress
                            value={Number(value)}
                            className="h-2 mt-2"
                          />
                        </div>
                      )
                    )}
                  </div>

                  {/* TOEIC Score (for opinion essay) */}
                  {topicId === "opinion-essay" &&
                    aiEvaluation.estimatedTOEICWritingScore && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">
                          Ước tính điểm TOEIC Writing
                        </h4>
                        <div className="text-3xl font-bold text-blue-600">
                          {aiEvaluation.estimatedTOEICWritingScore}/200
                        </div>
                      </div>
                    )}

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-700 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Điểm mạnh
                      </h4>
                      <ul className="space-y-1">
                        {aiEvaluation.strengths?.map(
                          (strength: string, index: number) => (
                            <li
                              key={index}
                              className="text-sm text-green-600 flex items-start gap-2"
                            >
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              {strength}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-orange-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Cần cải thiện
                      </h4>
                      <ul className="space-y-1">
                        {aiEvaluation.weaknesses?.map(
                          (weakness: string, index: number) => (
                            <li
                              key={index}
                              className="text-sm text-orange-600 flex items-start gap-2"
                            >
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                              {weakness}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Grammar Errors */}
                  {aiEvaluation.grammarErrors &&
                    aiEvaluation.grammarErrors.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-red-700 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Lỗi ngữ pháp cần sửa
                        </h4>
                        <div className="space-y-2">
                          {aiEvaluation.grammarErrors.map(
                            (error: any, index: number) => (
                              <div
                                key={index}
                                className="bg-red-50 border border-red-200 rounded-lg p-3"
                              >
                                <p className="text-sm">
                                  <span className="line-through text-red-600">
                                    {error.error}
                                  </span>
                                  <span className="mx-2">→</span>
                                  <span className="text-green-600 font-medium">
                                    {error.correction}
                                  </span>
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {error.explanation}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Improvement Suggestions */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Gợi ý cải thiện
                    </h4>
                    <ul className="space-y-1">
                      {aiEvaluation.improvementSuggestions?.map(
                        (suggestion: string, index: number) => (
                          <li
                            key={index}
                            className="text-sm text-purple-600 flex items-start gap-2"
                          >
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                            {suggestion}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Sample Improved Version */}
                  {(aiEvaluation.sampleImprovedDescription ||
                    aiEvaluation.sampleImprovedParagraph) && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Mẫu cải thiện
                      </h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800 italic">
                          {aiEvaluation.sampleImprovedDescription ||
                            aiEvaluation.sampleImprovedParagraph}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Chưa có đánh giá nào. Vui lòng nhấn "Đánh giá AI" để bắt
                    đầu.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Generated Email Sample Modal */}
        <Dialog
          open={!!generatedSample}
          onOpenChange={() => setGeneratedSample(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                Mẫu Email được tạo
              </DialogTitle>
              <DialogDescription>
                Email mẫu được tạo bởi AI dựa trên yêu cầu
              </DialogDescription>
            </DialogHeader>

            {generatedSample && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-blue-600">
                    Subject:
                  </label>
                  <p className="font-medium bg-blue-50 p-2 rounded">
                    {generatedSample.subject}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-blue-600">
                    Body:
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {generatedSample.body}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-blue-600">
                    Key Phrases:
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {generatedSample.keyPhrases?.map(
                      (phrase: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {phrase}
                        </Badge>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-blue-600">
                    Tone Analysis:
                  </label>
                  <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                    {generatedSample.toneAnalysis}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
