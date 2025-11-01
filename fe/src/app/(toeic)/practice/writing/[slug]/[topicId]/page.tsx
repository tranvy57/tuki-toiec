"use client";

import { useLessonsByModality, type LessonItem } from "@/api/useLessons";
import GrammarHighlightTextarea from "@/components/GrammarHighlightTextarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { writingExerciseTypes } from "@/data/mockDataWritting";
import { useAIFeatures } from "@/hooks/use-ai-features";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Zap
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function WritingExercisePage() {
  const params = useParams();
  const router = useRouter();
  const [userInput, setUserInput] = useState("");
  const [wordCount, setWordCount] = useState(0);
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

  // Fetch API data
  const { data: emailLessons, isLoading: emailLoading, error: emailError } = useLessonsByModality({
    modality: "email_reply",
    enabled: slug === "email-response"
  });

  const { data: pictureLessons, isLoading: pictureLoading, error: pictureError } = useLessonsByModality({
    modality: "describe_picture",
    enabled: slug === "describe-picture"
  });

  const { data: opinionLessons, isLoading: opinionLoading, error: opinionError } = useLessonsByModality({
    modality: "opinion_paragraph",
    enabled: slug === "opinion-essay"
  });

  // Get current lesson item from API or mock data
  let currentItem: LessonItem | null = null;
  let subTopic: any = null;

  if (slug === "email-response" && emailLessons) {
    // Find item in email API data
    for (const lesson of emailLessons) {
      const found = lesson.items.find(item => item.id === topicId);
      if (found) {
        currentItem = found;
        break;
      }
    }
  } else if (slug === "describe-picture" && pictureLessons) {
    // Find item in picture API data
    for (const lesson of pictureLessons) {
      const found = lesson.items.find(item => item.id === topicId);
      if (found) {
        currentItem = found;
        break;
      }
    }
  } else if (slug === "opinion-essay" && opinionLessons) {
    // Find item in opinion API data
    for (const lesson of opinionLessons) {
      const found = lesson.items.find(item => item.id === topicId);
      if (found) {
        currentItem = found;
        break;
      }
    }
  } else {
    // Use mock data for other types
    subTopic = exerciseData?.subTopics.find((sub) => sub.id === topicId);
  }

  // Check loading states
  const isLoading = (slug === "email-response" && emailLoading) ||
    (slug === "describe-picture" && pictureLoading) ||
    (slug === "opinion-essay" && opinionLoading);

  // Check error states
  const hasError = (slug === "email-response" && emailError) ||
    (slug === "describe-picture" && pictureError) ||
    (slug === "opinion-essay" && opinionError);

  // Check if data not found
  const isDataNotFound = (slug === "email-response" || slug === "describe-picture" || slug === "opinion-essay") && !currentItem;
  const isSubTopicNotFound = slug !== "email-response" && slug !== "describe-picture" && slug !== "opinion-essay" && !subTopic;
  const getCurrentExerciseData = () => {
    if (slug === "email-response" && currentItem) {
      return {
        title: currentItem.title.trim(),
        topic: currentItem.promptJsonb.directions,
        content: currentItem.promptJsonb.content,
        wordLimit: 150, // Default for email
        level: currentItem.difficulty,
        context: currentItem.promptJsonb.writing_type,
        tips: currentItem.solutionJsonb.tips,
        sampleAnswer: currentItem.solutionJsonb.sample_answer,
        imageUrl: null,
        keywords: null
      };
    } else if (slug === "describe-picture" && currentItem) {
      return {
        title: currentItem.title.trim(),
        topic: currentItem.promptJsonb.directions || "",
        content: null,
        wordLimit: 25, 
        level: currentItem.difficulty,
        context: currentItem.promptJsonb.writing_type,
        tips: currentItem.solutionJsonb.tips,
        sampleAnswer: currentItem.solutionJsonb.sample_answer,
        imageUrl: currentItem.promptJsonb.image_url,
        keywords: currentItem.promptJsonb.keywords
      };
    } else if (slug === "opinion-essay" && currentItem) {
      return {
        title: currentItem.title.trim(),
        topic: currentItem.promptJsonb.content || "", // The essay prompt is in content field
        content: null,
        wordLimit: 300, // Standard essay word limit
        level: currentItem.difficulty,
        context: currentItem.promptJsonb.writing_type,
        tips: currentItem.solutionJsonb.tips,
        sampleAnswer: currentItem.solutionJsonb.sample_answer,
        imageUrl: null,
        keywords: null
      };
    } else if (subTopic) {
      return {
        title: subTopic.title,
        topic: subTopic.topic,
        content: null,
        wordLimit: subTopic.wordLimit,
        level: subTopic.level,
        context: subTopic.context,
        tips: null,
        sampleAnswer: null,
        imageUrl: null,
        keywords: null
      };
    }
    return null;
  };

  const exerciseInfo = getCurrentExerciseData();


  // AI Evaluation Functions
  const handleAIEvaluation = async () => {
    if (!userInput.trim()) return;

    setIsEvaluating(true);
    setAiEvaluation(null);
    handleGenerateExample();

    try {
      let result;
      console.log(exerciseInfo)

      switch (slug) {
        case "describe-picture":
          result = await evaluateImageDescription.evaluateImageDescription({
            description: userInput,
            expectedElements: exerciseInfo?.keywords || [],
            descriptionType: "sentence",
            imageUrl: exerciseInfo?.imageUrl || undefined,
            sampleAnswer: exerciseInfo?.sampleAnswer || undefined,
          });
          break;

        case "email-response":
          result = await evaluateWriting.evaluateWriting({
            type: "email-response",
            title: exerciseInfo?.title || "",
            content: userInput,
            topic: exerciseInfo?.topic || "",
            context: exerciseInfo?.content || "Colleague/Manager",
          });
          break;

        case "opinion-essay":
          result = await evaluateWriting.evaluateWriting({
            type: "opinion-essay",
            content: userInput,
            topic: exerciseInfo?.topic || "",
            requiredLength: exerciseInfo?.wordLimit || 200,
            context: exerciseInfo?.context || "opinion",
          });
          break;

        // case "grammar-fix":
        //   // For grammar fix, we can use the writing evaluation as a general text evaluator
        //   result = await evaluateWriting.evaluateWriting({
        //     type: "email",
        //     content: userInput,
        //     title: "Grammar Check",
        //     topic: exerciseInfo?.topic || "",
        //     context: "Grammar practice",
        //   });
        //   break;

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

  useEffect(() => {
    // Count words
    const words = userInput
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);

    // Calculate progress based on word count
    if (exerciseInfo?.wordLimit) {
      const progressPercent = Math.min(
        (words.length / exerciseInfo.wordLimit) * 100,
        100
      );
      setProgress(progressPercent);
    }
  }, [userInput, exerciseInfo?.wordLimit]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Đang tải bài tập...</h2>
        </div>
      </div>
    );
  }

  // Show error for API-backed exercises
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Không thể tải bài tập</h2>
          <p className="text-gray-500 mb-4">Vui lòng thử lại sau</p>
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    );
  }

  // Show not found if no data for API-backed exercises
  if (isDataNotFound || isSubTopicNotFound) {
    if (isSubTopicNotFound) {
      console.warn("Subtopic not found:", topicId);
    }
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy bài tập</h2>
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    );
  }

  // All useEffect hooks must be called before any conditional returns


  // Helper function to get current exercise data

  return (
    <div className="min-h-(calc(100vh-72px)) bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-2">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          

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
                  Chủ đề: {exerciseInfo?.title}
                </div>
              </div>
              <div className="space-y-4 flex gap-8 mt-4">
                {/* Image for picture description */}
                {slug === "describe-picture" && exerciseInfo?.imageUrl && (
                  <div className="relative aspect-video h-80 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={exerciseInfo.imageUrl}
                      alt="Practice image"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  {/* Keywords for picture description */}
                  {slug === "describe-picture" && exerciseInfo?.keywords && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Từ khóa yêu cầu:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {exerciseInfo.keywords.map((keyword: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Email content for email response */}
                  {slug === "email-response" && exerciseInfo?.content && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Email gốc:</h4>
                      <div
                        className="bg-gray-50 p-3 rounded-lg text-sm"
                        dangerouslySetInnerHTML={{ __html: exerciseInfo.content }}
                      />
                    </div>
                  )}

                  {/* Prompt/Directions */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      {slug === "opinion-essay" ? "Essay Topic:" : "Yêu cầu:"}
                    </h4>
                    {slug === "opinion-essay" ? (
                      <div
                        className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg text-sm"
                        dangerouslySetInnerHTML={{ __html: exerciseInfo?.topic || "" }}
                      />
                    ) : (
                      <p className="text-gray-700 leading-relaxed">
                        {exerciseInfo?.topic}
                      </p>
                    )}
                  </div>

                  {/* Tips */}
                  {exerciseInfo?.tips && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Gợi ý:
                      </h4>
                      <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                        {exerciseInfo.tips}
                      </p>
                    </div>
                  )}

                  {/* Requirements */}
                  {exerciseInfo?.wordLimit && (
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>
                          {slug === "describe-picture"
                            ? `Viết 1 câu hoàn chỉnh (khoảng ${exerciseInfo.wordLimit} từ)`
                            : slug === "opinion-essay"
                              ? `Minimum ${exerciseInfo.wordLimit} từ (Essay)`
                              : `${exerciseInfo.wordLimit - 20}-${exerciseInfo.wordLimit + 20} từ`
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>


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
                        {wordCount}/{exerciseInfo?.wordLimit} từ
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
                placeholder={
                  slug === "describe-picture"
                    ? "Viết 1 câu mô tả hình ảnh sử dụng các từ khóa đã cho..."
                    : slug === "opinion-essay"
                      ? "Viết bài luận thể hiện quan điểm của bạn với các lý lẽ và ví dụ cụ thể... (Tối thiểu 300 từ)"
                      : "Bắt đầu viết câu trả lời của bạn... (Kiểm tra ngữ pháp tự động sẽ hoạt động khi bạn gõ)"
                }
                maxLength={(exerciseInfo?.wordLimit ?? 200) * 8} // Rough character estimate
                className={
                  slug === "describe-picture"
                    ? "min-h-[150px]"
                    : slug === "opinion-essay"
                      ? "min-h-[400px]" // Taller for essays
                      : "min-h-[300px]"
                }
              />
            </div>
          </motion.div>
        </div>

        {/* Show sample answer */}
        {exerciseInfo?.sampleAnswer && showAIFeedback && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Bài mẫu tham khảo
            </h4>
            {slug === "opinion-essay" ? (
              <div
                className="text-green-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: exerciseInfo.sampleAnswer }}
              />
            ) : (
              <p className="text-green-700 italic">
                {exerciseInfo.sampleAnswer}
              </p>
            )}
          </div>
        )}

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
