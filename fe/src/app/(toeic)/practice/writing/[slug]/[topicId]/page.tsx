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
import { writingExerciseTypes } from "@/data/mockDataWritting";

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
  const [generatedSampleModal, setGeneratedSampleModal] = useState<any>(false);
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
    handleGenerateExample();

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
    console.log("runThis", generatedSample);

    if (topicId !== "email-response") return;

    setIsGenerating(true);

    setGeneratedSample(null);

    try {
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
      } catch (e) {
        console.log("err", e);
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
    setShowAIFeedback(false);
    setGeneratedSample("");
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
      <div className="container mx-auto px-4 py-2">
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
            <div className="flex gap-6">
              <h1 className="text-2xl font-bold text-[#23085A]">
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
        <div className="flex flex-col gap-6">
          {/* Left Side - Prompt */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="h-fit sticky top-6 bg-white border p-4 rounded-sm">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  Chủ đề: {subTopic?.title}
                </div>
              </div>
              <div className="space-y-4">
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
                <p className="text-gray-700 leading-relaxed">
                  Đề bài: {subTopic?.topic}
                </p>

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
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="h-fit p-4 border rounded-sm bg-white">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold flex justify-between w-full">
                    Bài làm
                    <div className="flex flex-wrap gap-2 justify-end items-center">
                      <div className="text-sm text-gray-600 w-20">
                        {wordCount}/{subTopic?.wordLimit} từ
                      </div>
                      <Button
                        onClick={handleGrammarCheck}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Kiểm tra chính tả
                      </Button>

                      {/* {slug === "email-response" && (
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
                  )} */}

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
                        {isEvaluating ? "Đang đánh giá..." : "Nộp bài"}
                      </Button>

                      {/* <Button
                    onClick={handleSave}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Lưu bài
                  </Button> */}

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
                  </div>
                </div>
              </div>

              {/* input  */}
              <GrammarHighlightTextarea
                value={userInput}
                onChange={setUserInput}
                placeholder="Bắt đầu viết câu trả lời của bạn... (Kiểm tra ngữ pháp tự động sẽ hoạt động khi bạn gõ)"
                maxLength={(subTopic?.wordLimit ?? 200) * 8} // Rough character estimate
                className="min-h-[300px]"
              />
            </div>
          </motion.div>
        </div>

        {showAIFeedback && (
          <div className="space-y-6 mt-8">
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
                <div className="flex gap-4">
                  {Object.entries(aiEvaluation.breakdown || {}).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="text-center p-3 bg-gray-50 rounded-lg flex-1"
                      >
                        <div className="text-xl font-bold text-blue-600">
                          {Number(value)}
                        </div>
                        <div className="text-xs text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </div>
                        <Progress value={Number(value)} className="h-2 mt-2" />
                      </div>
                    )
                  )}
                </div>

                {/* TOEIC Score (for opinion essay) */}
                {slug === "opinion-essay" &&
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
                            className="text-sm flex items-start gap-2"
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
                        Gợi ý cải thiện văn phong:
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
                  Chưa có đánh giá nào. Vui lòng nhấn "Đánh giá AI" để bắt đầu.
                </p>
              </div>
            )}
          </div>
        )}

        {generatedSample && (
          <div className="space-y-4 mt-4">
            <h1 className="text-[#23085A] font-bold text-lg">
              Mẫu tham khảo:{" "}
            </h1>
            <div>
              <label className="text-sm font-medium text-[#23085A]">
                Subject:
              </label>
              <p className="font-medium bg-blue-50 p-2 rounded">
                {generatedSample.subject}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-[#23085A]">
                Body:
              </label>
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                {generatedSample.body}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#23085A]">
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
              <label className="text-sm font-medium text-[#23085A]">
                Tone Analysis:
              </label>
              <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                {generatedSample.toneAnalysis}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
